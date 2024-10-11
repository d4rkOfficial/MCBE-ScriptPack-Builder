import fs from "fs/promises"
import path from "node:path"
import { PNG } from "pngjs"
/**
 * @public
 */
export default async function generateFiles(
    packName,
    manifestRes,
    manifestBeh,
    selected_v_mc,
    selected_v_ui,
    selected_v_math,
    selected_v_data,
) {
    let projectPath = path.join(process.cwd(), packName)
    try {
        await fs.mkdir(path.join(projectPath, ".vscode"), { recursive: true })
        await fs.mkdir(path.join(projectPath, "resource_packs", packName), { recursive: true })
        await fs.mkdir(path.join(projectPath, "behavior_packs", packName), { recursive: true })
        await fs.mkdir(path.join(projectPath, "scripts"), { recursive: true })

        let packIcon = new PNG({ width: 1, height: 1 })
        packIcon.data = [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            255,
        ]
        await fs.writeFile(
            path.join(projectPath, "resource_packs", packName, "pack_icon.png"),
            PNG.sync.write(packIcon),
        )
        await fs.writeFile(
            path.join(projectPath, "behavior_packs", packName, "pack_icon.png"),
            PNG.sync.write(packIcon),
        )

        await fs.writeFile(
            path.join(projectPath, "resource_packs", packName, "manifest.json"),
            JSON.stringify(manifestRes, null, 4),
        )
        await fs.writeFile(
            path.join(projectPath, "behavior_packs", packName, "manifest.json"),
            JSON.stringify(manifestBeh, null, 4),
        )

        let content

        content = `import * as mc from "@minecraft/server"

function mainTick() {
    if (mc.system.currentTick % 100 === 0) {
        mc.world.sendMessage("Hello, world! @tick: " + mc.system.currentTick)
    }

    mc.system.run(mainTick)
}

mc.system.run(mainTick)`
        await fs.writeFile(path.join(projectPath, "scripts", "main.ts"), content)

        content = `PROJECT_NAME="starter"
MINECRAFT_PRODUCT="BedrockUWP"
CUSTOM_DEPLOYMENT_PATH=""`
        await fs.writeFile(path.join(projectPath, ".env"), content)

        content = `{
    "trailingComma": "all",
    "tabWidth": 4,
    "semi": false,
    "singleQuote": false,
    "bracketSpacing": true,
    "arrowParens": "always",
    "printWidth": 120,
    "endOfLine": "auto"
}`
        await fs.writeFile(path.join(projectPath, ".prettierrc.json"), content)

        content = `import minecraftLinting from "eslint-plugin-minecraft-linting"
import tsParser from "@typescript-eslint/parser"
import ts from "@typescript-eslint/eslint-plugin"

export default [
    {
        files: ["scripts/**/*.ts"],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: "latest",
        },
        plugins: {
            ts,
            "minecraft-linting": minecraftLinting,
        },
        rules: {
            "minecraft-linting/avoid-unnecessary-command": "error",
        },
    },
]`
        await fs.writeFile(path.join(projectPath, "eslint.config.mjs"), content)

        content = `import { argv, parallel, series, task, tscTask } from "just-scripts"
import {
    BundleTaskParameters,
    CopyTaskParameters,
    bundleTask,
    cleanTask,
    cleanCollateralTask,
    copyTask,
    coreLint,
    mcaddonTask,
    setupEnvironment,
    ZipTaskParameters,
    STANDARD_CLEAN_PATHS,
    DEFAULT_CLEAN_DIRECTORIES,
    getOrThrowFromProcess,
    watchTask,
} from "@minecraft/core-build-tasks"
import path from "path"

// Setup env variables
setupEnvironment(path.resolve(__dirname, ".env"))
const projectName = getOrThrowFromProcess("PROJECT_NAME")

const bundleTaskOptions: BundleTaskParameters = {
    entryPoint: path.join(__dirname, "./scripts/main.ts"),
    external: ["@minecraft/server", "@minecraft/server-ui"],
    outfile: path.resolve(__dirname, "./dist/scripts/main.js"),
    minifyWhitespace: false,
    sourcemap: true,
    outputSourcemapPath: path.resolve(__dirname, "./dist/debug"),
}

const copyTaskOptions: CopyTaskParameters = {
    copyToBehaviorPacks: [\`./behavior_packs/\${projectName}\`],
    copyToScripts: ["./dist/scripts"],
    copyToResourcePacks: [\`./resource_packs/\${projectName}\`],
}

const mcaddonTaskOptions: ZipTaskParameters = {
    ...copyTaskOptions,
    outputFile: \`./dist/packages/\${projectName}.mcaddon\`,
}

// Lint
task("lint", coreLint(["scripts/**/*.ts"], argv().fix))

// Build
task("typescript", tscTask())
task("bundle", bundleTask(bundleTaskOptions))
task("build", series("typescript", "bundle"))

// Clean
task("clean-local", cleanTask(DEFAULT_CLEAN_DIRECTORIES))
task("clean-collateral", cleanCollateralTask(STANDARD_CLEAN_PATHS))
task("clean", parallel("clean-local", "clean-collateral"))

// Package
task("copyArtifacts", copyTask(copyTaskOptions))
task("package", series("clean-collateral", "copyArtifacts"))

// Local Deploy used for deploying local changes directly to output via the bundler. It does a full build and package first just in case.
task(
    "local-deploy",
    watchTask(
        ["scripts/**/*.ts", "behavior_packs/**/*.{json,lang,png}", "resource_packs/**/*.{json,lang,png}"],
        series("clean-local", "build", "package"),
    ),
)

// Mcaddon
task("createMcaddonFile", mcaddonTask(mcaddonTaskOptions))
task("mcaddon", series("clean-local", "build", "createMcaddonFile"))
`
        await fs.writeFile(path.join(projectPath, "just.config.ts"), content)

        content = `{
    "name": "${packName}",
    "version": "0.1.0",
    "productName": "${packName}",
    "description": "${packName}",
    "private": true,
    "devDependencies": {
        "@minecraft/core-build-tasks": "^1.1.3",
        "eslint-plugin-minecraft-linting": "^1.2.2",
        "source-map": "^0.7.4",
        "ts-node": "^10.9.1",
        "typescript": "^5.5.4"
    },
    "scripts": {
        "lint": "just-scripts lint",
        "build": "just-scripts build",
        "clean": "just-scripts clean",
        "local-deploy": "just-scripts local-deploy",
        "mcaddon": "just-scripts mcaddon",
        "enablemcloopback": "CheckNetIsolation.exe LoopbackExempt -a -p=S-1-15-2-1958404141-86561845-1752920682-3514627264-368642714-62675701-733520436",
        "enablemcpreviewloopback": "CheckNetIsolation.exe LoopbackExempt -a -p=S-1-15-2-424268864-5579737-879501358-346833251-474568803-887069379-4040235476"
    },
    "dependencies": {
        "@minecraft/math": "^${selected_v_math}",
        "@minecraft/server": "^${selected_v_mc}",
        "@minecraft/server-ui": "^${selected_v_ui}",
        "@minecraft/vanilla-data": "^${selected_v_data}"
    }
}`
        await fs.writeFile(path.join(projectPath, "package.json"), content)

        content = `{
    "recommendations": [
        "esbenp.prettier-vscode",
        "blockceptionltd.blockceptionvscodeminecraftbedrockdevelopmentextension",
        "mojang-studios.minecraft-debugger"
    ]
}`
        await fs.writeFile(path.join(projectPath, ".vscode", "extensions.json"), content)

        content = `{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "minecraft-js",
            "request": "attach",
            "name": "Debug with Minecraft",
            "mode": "listen",
            "preLaunchTask": "build",
            "sourceMapRoot": "\${workspaceFolder}/dist/debug/",
            "generatedSourceRoot": "\${workspaceFolder}/dist/scripts/",
            "port": 19144
        }
    ]
}`
        await fs.writeFile(path.join(projectPath, ".vscode", "launch.json"), content)

        content = `{
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[json]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "git.ignoreLimitWarning": true,
    "editor.formatOnSave": true,
    "search.exclude": {
        "**/.git": true,
        "**/node_modules": true,
        "**/dist": true,
        "**/lib": true
    },
    "files.exclude": {
        "**/.git": true,
        "**/.DS_Store": true,
        "**/node_modules": true
    },
    "cSpell.words": ["gametest", "gametests", "mcaddon", "minecart", "shulker", "zoglin"],
    "editor.tabSize": 4,
    "eslint.experimental.useFlatConfig": true
}`
        await fs.writeFile(path.join(projectPath, ".vscode", "settings.json"), content)

        content = `{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "build",
            "type": "shell",
            "command": "npm run build"
        },
        {
            "label": "deploy",
            "type": "shell",
            "command": "npm run local-deploy"
        }
    ]
}`
        await fs.writeFile(path.join(projectPath, ".vscode", "tasks.json"), content)
    } catch (err) {
        throw err
    }
}
