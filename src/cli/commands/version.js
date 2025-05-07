/**
 * @fileoverview 版本命令实现
 */

import { input } from '@inquirer/prompts'
import { CLI_MESSAGES } from '../../constants/messages.js'
import { CONSOLE_COLORS } from '../../constants/configs.js'

/**
 * 显示版本信息
 * @returns {Promise<void>}
 */
export async function printVersion () {
  // 显示版本信息
  process.stdout.write(CLI_MESSAGES.VERSION_INFO)

  // 等待用户按回车键退出
  await input({
    message: CONSOLE_COLORS.HIDDEN,
    required: false
  })
}
