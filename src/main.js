import getDepVersions from "./func/GetDepVersions.js"
import generateFiles from "./func/GenerateFiles.js"
import printHelp from "./cmd/Help.js"
import printVersion from "./cmd/Version.js"
import createManifest from "./func/CreateManifest.js"
import { confirm, input, select } from "@inquirer/prompts"
import { randomUUID } from "crypto"
import ProgressBar from "./classes/ProgressBar.js"

try {
    let processArgs = new Map()
    let { argv } = process
    for (let i = 0; i < argv.length; i++) {
        if (argv[i].startsWith("-")) {
            let next = argv?.[i + 1] ?? ""
            if (next.startsWith("-")) {
                processArgs.set(argv[i], "")
            } else {
                processArgs.set(argv[i], next.toLowerCase() ?? "")
                i++
            }
        }
    }

    if (processArgs.has("--help") || processArgs.has("-h")) {
        await printHelp()
        process.exit(0)
    }

    if (processArgs.has("--version") || processArgs.has("-v")) {
        await printVersion()
        process.exit(0)
    }

    let name = processArgs.get("--name") ?? (await input({ message: "Name:", required: true }))
    let desc = processArgs.get("--desc") ?? (await input({ message: "Desc:", required: true }))
    let auth = processArgs.get("--author") ?? (await input({ message: "Author:" })) ?? "unknown"

    let validate = (uuidInput) => /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(uuidInput.trim().toLowerCase())
    let uuid1 = processArgs.get("--uuid1") ?? (await input({ message: "UUID(Rp):", default: randomUUID(), validate }))
    let uuid2 = processArgs.get("--uuid2") ?? (await input({ message: "UUID(Rm):", default: randomUUID(), validate }))
    let uuid3 = processArgs.get("--uuid3") ?? (await input({ message: "UUID(Bp):", default: randomUUID(), validate }))
    let uuid4 = processArgs.get("--uuid4") ?? (await input({ message: "UUID(Bm):", default: randomUUID(), validate }))

    /**
     * [x] @minecraft/server                    (internal)
     * [x] @minecraft/server-ui                 (internal)
     * [ ] @minecraft/server-gametest           (internal)
     * [ ] @minecraft/common                    (internal)
     * [ ] @minecraft/debug-utilities           (internal)
     * [ ] @minecraft/server-admin              (internal) (bds_only)
     * [ ] @minecraft/server-net                (internal) (bds_only)
     * [ ] @minecraft/server-editor             (internal) (prerelease)
     * [x] @minecraft/vanilla-data              (external) (important)
     * [ ] @minecraft/math                      (external) (unimportant)
     */
    let v_mc, v_ui, v_test, v_data
    await ProgressBar.listen(async (setProgress, setHintText, close, sleep) => {
        setHintText("Getting versions of dependencies...")
        await sleep(1000)
        setHintText("")
        v_mc = await getDepVersions("@minecraft/server")
        await sleep(100)
        setProgress(1, 3)
        v_ui = await getDepVersions("@minecraft/server-ui")
        await sleep(100)
        setProgress(2, 3)
        v_data = await getDepVersions("@minecraft/vanilla-data")
        await sleep(100)
        setProgress(3, 3)
        await sleep(500)
        close("\x1b[32m✔\x1b[0m Successfully getting versions of dependencies!")
    })

    let selected_v_mc, selected_v_ui, selected_v_math, selected_v_data
    if (await confirm({ message: "Use Latest Dependencies?", default: false })) {
        selected_v_mc = v_mc.filter((v) => !v.includes("-"))[0]
        selected_v_ui = v_ui.filter((v) => !v.includes("-"))[0]
        selected_v_data = v_data.filter((v) => !v.includes("-"))[0]

        process.stdout.write(`\x1b[32m✔\x1b[0m @minecraft/server version: \x1b[36m${selected_v_mc}\x1b[0m\n`)
        process.stdout.write(`\x1b[32m✔\x1b[0m @minecraft/server-ui version: \x1b[36m${selected_v_ui}\x1b[0m\n`)
        process.stdout.write(`\x1b[32m✔\x1b[0m @minecraft/vanilla-data version: \x1b[36m${selected_v_data}\x1b[0m\n`)
        process.stdout.write(`\x1b[35m  (automatically)\x1b[0m\n`)
    } else {
        selected_v_mc = await chooseVersion(v_mc, "@minecraft/server version:")
        selected_v_ui = await chooseVersion(v_ui, "@minecraft/server-ui version:")
        selected_v_data = await chooseVersion(v_data, "@minecraft/vanilla-data version:")
        process.stdout.write(`\x1b[35m  (manually)\x1b[0m\n`)

        async function chooseVersion(versionList, message) {
            let choices = versionList.map((version) => ({ name: version, value: version, description: "" }))
            let answer = await select({ message, choices, pageSize: 7, loop: false })
            return answer
        }
    }

    let [manifestRes, manifestBeh] = await createManifest({
        name,
        desc,
        auth,
        uuid1,
        uuid2,
        uuid3,
        uuid4,
        min_engine_version: (
            await input({
                message: "Min-Engine-Version:",
                default: selected_v_data
                    .split("-")[0]
                    .split(".")
                    .map((val, idx) => (idx === 2 ? 0 : val))
                    .join("."),
                validate: (input) => /^\s*\d+\s*\.\s*\d+\s*\.\s*\d+\s*$/.test(input),
            })
        )
            .split(".")
            .map((ver) => Number(ver.trim())),
        minecraft_server_version: selected_v_mc.split("-")[0],
        minecraft_server_ui_version: selected_v_ui.split("-")[0],
    })

    if (!(await confirm({ message: "Is that ok?", default: true }))) {
        throw void 0
    }

    await generateFiles(name, manifestRes, manifestBeh, selected_v_mc, selected_v_ui, selected_v_data)

    process.stdout.write(`\x1b[1mNow run:\x1b[0m
    cd ${name}
    npm i
    powershell Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    `)
} catch {
    process.stdout.write("aborted!\n")
} finally {
    process.exit(0)
}
