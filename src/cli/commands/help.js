/**
 * @fileoverview 帮助命令实现
 */

import { input } from '@inquirer/prompts'
import { CLI_MESSAGES } from '../../constants/messages.js'
import { CONSOLE_COLORS } from '../../constants/configs.js'
import { centerText, colorize } from '../../utils/format.js'

/**
 * 生成帮助文本
 * @returns {string} 格式化的帮助文本
 */
function generateHelpText() {
    return [
        colorize(centerText(CLI_MESSAGES.HELP_TITLE), CONSOLE_COLORS.GREEN),
        colorize(CLI_MESSAGES.HELP_USAGE, CONSOLE_COLORS.CYAN),
        '',
        CLI_MESSAGES.HELP_DESCRIPTION,
        '',
        CLI_MESSAGES.HELP_PACK_INFO,
        '',
        centerText(CLI_MESSAGES.HELP_EXIT)
    ].join('\n')
}

/**
 * 显示帮助信息
 * @returns {Promise<void>}
 */
export async function printHelp() {
    // 显示帮助文本
    process.stdout.write(generateHelpText())
    
    // 等待用户按回车键退出
    await input({ 
        message: CONSOLE_COLORS.HIDDEN,
        required: false 
    })
}
