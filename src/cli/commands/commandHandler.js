/**
 * @fileoverview 命令行处理器
 */

import { CLI_MESSAGES } from '../../constants/messages.js'
import { printHelp } from './help.js'
import { printVersion } from './version.js'
import { validateUUID, validateProjectName, validateDescription } from '../../utils/validation.js'
import { input, select, confirm } from '@inquirer/prompts'
import { randomUUID } from 'crypto'

/**
 * 解析命令行参数
 * @returns {Map<string, string>} 解析后的参数映射
 */
export function parseCommandLineArgs() {
    const processArgs = new Map()
    const { argv } = process

    for (let i = 0; i < argv.length; i++) {
        if (argv[i].startsWith('-')) {
            const next = argv[i + 1] ?? ''
            if (next.startsWith('-')) {
                processArgs.set(argv[i], '')
            } else {
                processArgs.set(argv[i], next.toLowerCase() ?? '')
                i++
            }
        }
    }

    return processArgs
}

/**
 * 处理帮助和版本命令
 * @param {Map<string, string>} args - 命令行参数
 * @returns {boolean} 是否处理了命令
 */
export function handleHelpAndVersion(args) {
    if (args.has('--help') || args.has('-h')) {
        printHelp()
        return true
    }

    if (args.has('--version') || args.has('-v')) {
        printVersion()
        return true
    }

    return false
}

/**
 * 获取项目基本信息
 * @param {Map<string, string>} args - 命令行参数
 * @returns {Promise<Object>} 项目基本信息
 */
export async function getProjectInfo(args) {
    const name = args.get('--name') ?? await input({ 
        message: CLI_MESSAGES.PROMPT_NAME,
        validate: validateProjectName
    })

    const desc = args.get('--desc') ?? await input({ 
        message: CLI_MESSAGES.PROMPT_DESC,
        validate: validateDescription
    })

    const auth = args.get('--author') ?? 
                await input({ message: CLI_MESSAGES.PROMPT_AUTHOR }) ?? 
                'unknown'

    return { name, desc, auth }
}

/**
 * 获取UUID信息
 * @param {Map<string, string>} args - 命令行参数
 * @returns {Promise<Object>} UUID信息
 */
export async function getUUIDs(args) {
    const uuid1 = args.get('--uuid1') ?? await input({ 
        message: CLI_MESSAGES.PROMPT_UUID_RESOURCE,
        default: randomUUID(),
        validate: validateUUID
    })

    const uuid2 = args.get('--uuid2') ?? await input({
        message: CLI_MESSAGES.PROMPT_UUID_MODULE,
        default: randomUUID(),
        validate: validateUUID
    })

    const uuid3 = args.get('--uuid3') ?? await input({
        message: CLI_MESSAGES.PROMPT_UUID_BEHAVIOR,
        default: randomUUID(),
        validate: validateUUID
    })

    const uuid4 = args.get('--uuid4') ?? await input({
        message: CLI_MESSAGES.PROMPT_UUID_SCRIPT,
        default: randomUUID(),
        validate: validateUUID
    })

    return { uuid1, uuid2, uuid3, uuid4 }
}

/**
 * 选择依赖版本
 * @param {string[]} versionList - 版本列表
 * @param {string} message - 提示消息
 * @returns {Promise<string>} 选择的版本
 */
export async function chooseVersion(versionList, message) {
    const choices = versionList.map(version => ({
        name: version,
        value: version,
        description: ''
    }))

    return await select({ 
        message, 
        choices, 
        pageSize: 7, 
        loop: false 
    })
}

/**
 * 获取依赖版本信息
 * @param {Object} versions - 可用的版本列表
 * @returns {Promise<Object>} 选择的版本信息
 */
export async function getDependencyVersions(versions) {
    const useLatest = await confirm({ 
        message: CLI_MESSAGES.PROMPT_USE_LATEST,
        default: false
    })

    if (useLatest) {
        return {
            serverVersion: versions.server.find(v => !v.includes('-')),
            uiVersion: versions.ui.find(v => !v.includes('-')),
            testVersion: versions.test.find(v => !v.includes('-')),
            dataVersion: versions.data.find(v => !v.includes('-')),
            isAutomatic: true
        }
    }

    return {
        serverVersion: await chooseVersion(versions.server, CLI_MESSAGES.VERSION_SELECT_SERVER),
        uiVersion: await chooseVersion(versions.ui, CLI_MESSAGES.VERSION_SELECT_UI),
        // testVersion: await chooseVersion(versions.test, CLI_MESSAGES.VERSION_SELECT_GAMETEST),
        dataVersion: await chooseVersion(versions.data, CLI_MESSAGES.VERSION_SELECT_DATA),
        isAutomatic: false
    }
}

/**
 * 确认配置
 * @returns {Promise<boolean>} 是否确认
 */
export async function confirmConfiguration() {
    return await confirm({ 
        message: CLI_MESSAGES.PROMPT_CONFIRM,
        default: true
    })
}
