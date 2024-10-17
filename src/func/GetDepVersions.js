import fs from "node:fs/promises"
import path from "node:path"
import { tmpdir } from "node:os"

/**
 * @private
 * @typedef {`@minecraft/${'common'|'debug-utilities'|`server${'-admin'|'-gametest'|'-net'|'-ui'|'-editor'|''}`|'vanilla-data'}`} Module
 * @description Represents available Minecraft modules, with vanilla-data being the only external module.
 */

/**
 * @private
 * @typedef {Object} Options
 * @property {boolean=} isBeta - Determines if beta versions should be included.
 * @property {number=} page - The page number of results.
 * @property {number=} pageSize - The number of results per page.
 */

/**
 * @private
 * @typedef {`${number}.${number}.${number}${`'-'${string}`|''}`} DependencyVersion
 * @description Represents the format for dependency version strings.
 */

/**
 * @private
 * @typedef {[number, number, number]} MinEngineVersion
 * @description Represents the minimum engine version as an array of three numbers.
 */

/**
 * @private
 * @type {Map<Module, DependencyVersion[]>}
 */
let versionMap = new Map()

/**
 * @public
 * @function getDependencyVersions
 * @param {Module} module - The module to query.
 * @param {Options} options - The query options.
 * @returns {Promise<DependencyVersion[]>} - A promise that resolves to the list of dependency versions for the specified module.
 */
export default async function getDependencyVersions(module, options = { isBeta: false }) {
    let versionList

    if (!versionMap.has(module)) {
        await loadLocalVersions(module)
    }

    if (!versionMap.has(module)) {
        await downloadVersions(module)
    }

    const { isBeta } = options
    versionList = [...versionMap.get(module)]

    if (isBeta) {
        versionList = versionList.filter((version) => version.includes("-"))
    }

    return versionList
}

/**
 * @private
 * @param {Module} module - The module to load versions for.
 * @returns {Promise<void>}
 */
async function loadLocalVersions(module) {
    const logFileList = (await fs.readdir(tmpdir()))
        .filter((file) => /^mcbespb-/.test(file) && /-\d{4}-\d{1,2}-\d{1,2}.log$/.test(file))
        .filter((file) => file.includes(module.replace("/", "_")))
        .filter((file) => {
            const date = new Date(file.match(/\d{4}-\d{1,2}-\d{1,2}/)[0])
            return date - new Date() <= 0x75a40 // Filter for recent log files
        })
        .sort((file1, file2) => {
            const [date1, date2] = [new Date(file1.match(/\d{4}-\d{1,2}-\d{1,2}/)[0]), new Date(file2.match(/\d{4}-\d{1,2}-\d{1,2}/)[0])]
            return date1 - date2
        })

    if (logFileList[0]) {
        const buffer = await fs.readFile(path.resolve(tmpdir(), logFileList[0]))
        const content = buffer.toString("utf-8")
        versionMap.set(
            module,
            content.split("\n").filter((line) => line.trim()),
        )
    }
}

/**
 * @private
 * @param {Module} module - The module to download versions for.
 * @returns {Promise<void>}
 */
async function downloadVersions(module) {
    for (const mirror of [
        "https://registry.npmjs.org/",
        "http://registry.npmmirror.com/",
        "https://npm.aliyun.com/",
        "https://mirrors.cloud.tencent.com/npm/",
        "https://mirrors.huaweicloud.com/repository/npm/",
        "https://mirrors.163.com/npm/",
        "http://mirrors.ustc.edu.cn/",
        "https://mirrors.tuna.tsinghua.edu.cn/",
    ]) {
        let response
        try {
            const controller = new AbortController()
            const timeoutSignal = controller.signal
            const TIMEOUT_DELAY = 5000
            setTimeout(() => controller.abort(), TIMEOUT_DELAY)
            response = await fetch(`${mirror}${module}`, { signal: timeoutSignal })
        } catch {
            continue // Skip to the next mirror if fetch fails
        }

        const { versions } = await response.json()
        const uniqueVersions = [...new Set(Object.keys(versions))].reverse()
        versionMap.set(module, uniqueVersions)

        const now = new Date()
        const localTime = new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000)
        const logName = `mcbespb-${module.replace("/", "_")}-${localTime.getFullYear()}-${localTime.getMonth() + 1}-${localTime.getDate()}.log`
        const logContent = uniqueVersions.join("\n")
        const logPath = path.resolve(tmpdir(), logName)

        try {
            await fs.writeFile(logPath, logContent)
        } catch {}

        break // Exit after the first successful fetch
    }
}
