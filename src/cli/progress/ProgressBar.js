/**
 * @fileoverview 进度条实现
 */

import { createProgressBar, formatSuccess } from '../../utils/format.js'
import { PROGRESS_BAR } from '../../constants/configs.js'

/**
 * 进度条类
 */
export class ProgressBar {
  /**
     * @param {number} total - 总步骤数
     * @param {number} width - 进度条宽度
     */
  constructor (total = PROGRESS_BAR.TOTAL_STEPS, width = 20) {
    this.total = total
    this.current = 0
    this.width = width
    this.hintText = ''
  }

  /**
     * 更新进度
     * @param {number} current - 当前进度
     * @param {number} total - 总进度（可选）
     */
  setProgress (current, total = this.total) {
    this.current = current
    this.total = total
    this.render()
  }

  /**
     * 设置提示文本
     * @param {string} text - 提示文本
     */
  setHintText (text) {
    this.hintText = text
    this.render()
  }

  /**
     * 渲染进度条
     */
  render () {
    // 清除当前行
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)

    // 如果有提示文本，显示提示文本
    if (this.hintText) {
      process.stdout.write(this.hintText)
      return
    }

    // 显示进度条
    if (this.current > 0) {
      const progressBar = createProgressBar(this.current, this.total, this.width)
      process.stdout.write(progressBar)
    }
  }

  /**
     * 完成进度条
     * @param {string} message - 完成消息
     */
  complete (message) {
    // 清除当前行
    process.stdout.clearLine(0)
    process.stdout.cursorTo(0)

    // 显示完成消息
    process.stdout.write(formatSuccess(message) + '\n')
  }

  /**
     * 创建延时函数
     * @param {number} ms - 延时毫秒数
     * @returns {Promise<void>}
     */
  static sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
     * 监听进度
     * @param {Function} callback - 回调函数，接收 setProgress, setHintText, complete, sleep 作为参数
     * @returns {Promise<void>}
     */
  static async listen (callback) {
    const progressBar = new ProgressBar()

    try {
      await callback(
        progressBar.setProgress.bind(progressBar),
        progressBar.setHintText.bind(progressBar),
        progressBar.complete.bind(progressBar),
        ProgressBar.sleep
      )
    } catch (error) {
      // 确保在发生错误时清理进度条
      process.stdout.clearLine(0)
      process.stdout.cursorTo(0)
      throw error
    }
  }
}
