import fs from "node:fs/promises"
import path from "node:path"
import { tmpdir } from "node:os"

/**
 * @private
 * @typedef {`@minecraft/${'common'|'debug-utilities'|`server${'-admin'|'-gametest'|'-net'|'-ui'|'-editor'|''}`|'vanilla-data'}`} Module
 * @desc except for vanilla-data, they are all internal module, that runs as dependencies in minecraft client or BDS
 * @desc vanilla-data is special, an external module, but still need version inquery, in which way min engine version can be confirmed
 */

/**
 * @private
 * @typedef {Object} Options
 * @property {boolean=} beta
 * @property {number=} page
 * @property {number=} pageSize
 */

/**
 * @private
 * @typedef {`${number}.${number}.${number}${`'-'${string}`|''}`} DependencyVersionFormat
 */

/**
 * @private
 * @typedef {[number, number, number]} MinEngineVersionFormat
 */

/**
 * @private
 * @type {Map<Module, DependencyVersionFormat[]>}
 */
let versionLists = new Map()

/**
 * @public
 * @function getDepVersions
 * @param {Module} module
 * @param {Options} options
 * @returns {Promise<DependencyVersionFormat[]>}
 */
export default async function getDepVersions(module, options = { beta: false }) {
    let result

    if (!versionLists.has(module)) {
        await loadLoacalVersions(module)
    }

    if (!versionLists.has(module)) {
        await downloadVersions(module)
    }

    let { beta } = options
    let versionList = versionLists.get(module)
    result = [...versionList]
    if (beta) {
        result = result.filter((version) => version.includes("-"))
    }

    return result
}

/**
 * @private
 * @param {Module} module
 * @returns {Promise<void>}
 */
async function loadLoacalVersions(module) {
    let logFileList = (await fs.readdir(tmpdir()))
        .filter((file) => /^mcbespb-/.test(file) && /-\d{4}-\d{1,2}-\d{1,2}.log$/.test(file))
        .filter((file) => file.includes(module.replace('/', '_')))
        .filter((file) => {
            let date = new Date(file.match(/\d{4}-\d{1,2}-\d{1,2}/)[0])
            return date - new Date() <= 0x75a40
        })
        .sort((...file) => {
            let [date1, date2] = file.map((name) => new Date(name.match(/\d{4}-\d{1,2}-\d{1,2}/)[0]))
            return date1 > date2
        })

    if (logFileList[0]) {
        let buffer = fs.readFile(path.resolve(tmpdir(), logFileList[0]))
        let content = (await buffer).toString("utf-8")
        versionLists.set(
            module,
            content.split("\n").filter((content) => content.trim()),
        )
    }
}

/**
 * @private
 * @param {Module} module
 * @returns {Promise<void>}
 */
async function downloadVersions(module) {
    for (let mirror of [
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
            let controller = new AbortController()
            let abortSignal = controller.signal
            let TIMEOUT_DELAY = 5000
            setTimeout(() => controller.abort(), TIMEOUT_DELAY)
            response = await fetch(`${mirror}${module}`, { signal: abortSignal })
        } catch {
            continue
        }

        let { versions } = await response.json()
        let versionsFinal = [...new Set(Object.keys(versions))].reverse()
        versionLists.set(module, versionsFinal)

        let now = new Date()
        let localTime = new Date(now.getTime() + now.getTimezoneOffset() * 0xe800)
        let year = localTime.getFullYear()
        let month = localTime.getMonth() + 1
        let day = localTime.getDate()

        let logName = `mcbespb-${module.replace('/', '_')}-${year}-${month}-${day}.log`
        let logContent = versionsFinal.join(`\n`)
        let logPath = path.resolve(tmpdir(), logName)

        try {
            await fs.writeFile(logPath, logContent)
        } catch {}

        break
    }
}


