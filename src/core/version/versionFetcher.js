/**
 * @fileoverview 依赖版本获取器
 */

import fs from "node:fs/promises"
import path from "node:path"
import { tmpdir } from "node:os"

/**
 * @typedef {`@minecraft/${'common'|'debug-utilities'|`server${'-admin'|'-gametest'|'-net'|'-ui'|'-editor'|''}`|'vanilla-data'}`} Module
 * @description 可用的 Minecraft 模块，vanilla-data 是唯一的外部模块
 */

/**
 * @typedef {Object} Options
 * @property {boolean=} isBeta - 是否包含测试版本
 */

/**
 * @typedef {`${number}.${number}.${number}${`'-'${string}`|''}`} DependencyVersion
 * @description 依赖版本字符串的格式
 */

/**
 * @typedef {[number, number, number]} MinEngineVersion
 * @description 最小引擎版本，表示为三个数字的数组
 */

/**
 * @type {Map<Module, DependencyVersion[]>}
 * @private
 */
let versionMap = new Map()

/**
 * 从本地缓存加载版本信息
 * @param {Module} module - 要加载版本的模块
 * @returns {Promise<void>}
 * @private
 */
async function loadLocalVersions(module) {
    const logFileList = (await fs.readdir(tmpdir()))
        .filter((file) => /^mcbespb-/.test(file) && /-\d{4}-\d{1,2}-\d{1,2}.log$/.test(file))
        .filter((file) => file.includes(module.replace("/", "_")))
        .filter((file) => {
            const date = new Date(file.match(/\d{4}-\d{1,2}-\d{1,2}/)[0])
            return date - new Date() <= 0x75a40 // 过滤最近的日志文件
        })
        .sort((file1, file2) => {
            const [date1, date2] = [
                new Date(file1.match(/\d{4}-\d{1,2}-\d{1,2}/)[0]),
                new Date(file2.match(/\d{4}-\d{1,2}-\d{1,2}/)[0])
            ]
            return date1 - date2
        })

    if (logFileList[0]) {
        const buffer = await fs.readFile(path.resolve(tmpdir(), logFileList[0]))
        const content = buffer.toString("utf-8")
        versionMap.set(
            module,
            content.split("\n").filter((line) => line.trim())
        )
    }
}

/**
 * 从 npm 镜像下载版本信息
 * @param {Module} module - 要下载版本的模块
 * @returns {Promise<void>}
 * @private
 */
async function downloadVersions(module) {
    const mirrors = [
        "https://registry.npmjs.org/",
        "http://registry.npmmirror.com/",
        "https://npm.aliyun.com/",
        "https://mirrors.cloud.tencent.com/npm/",
        "https://mirrors.huaweicloud.com/repository/npm/",
        "https://mirrors.163.com/npm/",
        "http://mirrors.ustc.edu.cn/",
        "https://mirrors.tuna.tsinghua.edu.cn/"
    ]

    for (const mirror of mirrors) {
        let response
        try {
            const controller = new AbortController()
            const timeoutSignal = controller.signal
            const TIMEOUT_DELAY = 5000
            setTimeout(() => controller.abort(), TIMEOUT_DELAY)
            response = await fetch(`${mirror}${module}`, { signal: timeoutSignal })
        } catch {
            continue // 如果获取失败，尝试下一个镜像
        }

        const { versions } = await response.json()
        const uniqueVersions = [...new Set(Object.keys(versions))].reverse()
        versionMap.set(module, uniqueVersions)

        // 保存版本信息到本地缓存
        const now = new Date()
        const localTime = new Date(now.getTime() + now.getTimezoneOffset() * 60 * 1000)
        const logName = `mcbespb-${module.replace("/", "_")}-${localTime.getFullYear()}-${localTime.getMonth() + 1}-${localTime.getDate()}.log`
        const logContent = uniqueVersions.join("\n")
        const logPath = path.resolve(tmpdir(), logName)

        try {
            await fs.writeFile(logPath, logContent)
        } catch {}

        break // 成功获取后退出循环
    }
}

/**
 * 获取依赖版本列表
 * @param {Module} module - 要查询的模块
 * @param {Options} options - 查询选项
 * @returns {Promise<DependencyVersion[]>} 指定模块的依赖版本列表
 * @public
 */
export default async function getDependencyVersions(module, options = { isBeta: false }) {
    let versionList

    // 尝试从本地缓存加载
    if (!versionMap.has(module)) {
        await loadLocalVersions(module)
    }

    // 如果本地没有，从远程下载
    if (!versionMap.has(module)) {
        await downloadVersions(module)
    }

    const { isBeta } = options
    versionList = [...versionMap.get(module)]

    // 根据选项过滤版本
    if (isBeta) {
        versionList = versionList.filter((version) => version.includes("-"))
    }

    return versionList
}
