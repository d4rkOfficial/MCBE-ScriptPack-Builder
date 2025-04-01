/**
 * @fileoverview 文件模板定义
 */

import { dedent } from '../utils/format.js'

export const FILE_TEMPLATES = {
    // TypeScript 主文件模板
    MAIN_SCRIPT: dedent(`
        import * as mc from "@minecraft/server"

        function mainTick() {
            if (mc.system.currentTick % 100 === 0) {
                mc.world.sendMessage("Hello, world! @tick: " + mc.system.currentTick)
            }

            mc.system.run(mainTick)
        }

        mc.system.run(mainTick)`),

    // 环境配置文件模板
    ENV: dedent(`
        PROJECT_NAME="{projectName}"
        MINECRAFT_PRODUCT="BedrockUWP"
        CUSTOM_DEPLOYMENT_PATH=""`),

    // Prettier 配置模板
    PRETTIER_CONFIG: dedent(`{
        "trailingComma": "all",
        "tabWidth": 4,
        "semi": false,
        "singleQuote": false,
        "bracketSpacing": true,
        "arrowParens": "always",
        "printWidth": 120,
        "endOfLine": "auto"
    }`),

    // ESLint 配置模板
    ESLINT_CONFIG: dedent(`
        import minecraftLinting from "eslint-plugin-minecraft-linting"
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
        ]`),

    // Just 配置模板
    JUST_CONFIG: dedent(`
        import { argv, parallel, series, task, tscTask } from "just-scripts"
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
        task("mcaddon", series("clean-local", "build", "createMcaddonFile"))`),

    // VSCode 配置模板
    VSCODE: {
        EXTENSIONS: dedent(`{
            "recommendations": [
                "esbenp.prettier-vscode",
                "blockceptionltd.blockceptionvscodeminecraftbedrockdevelopmentextension",
                "mojang-studios.minecraft-debugger"
            ]
        }`),

        LAUNCH: dedent(`{
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
        }`),

        SETTINGS: dedent(`{
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
        }`),

        TASKS: dedent(`{
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
        }`)
    },

    // Package.json 模板
    PACKAGE_JSON: dedent(`{
        "name": "{name}",
        "version": "0.1.0",
        "productName": "{name}",
        "description": "{description}",
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
            "watch": "just-scripts local-deploy -- --watch",
            "mcaddon": "just-scripts mcaddon",
            "enablemcloopback": "CheckNetIsolation.exe LoopbackExempt -a -p=S-1-15-2-1958404141-86561845-1752920682-3514627264-368642714-62675701-733520436",
            "enablemcpreviewloopback": "CheckNetIsolation.exe LoopbackExempt -a -p=S-1-15-2-424268864-5579737-879501358-346833251-474568803-887069379-4040235476"
        },
        "dependencies": {
            "@minecraft/server": "^{serverVersion}",
            "@minecraft/server-ui": "^{uiVersion}",
            "@minecraft/server-gametest": "{gametestVersion}",
            "@minecraft/vanilla-data": "^{dataVersion}"
        }
    }`)
}
