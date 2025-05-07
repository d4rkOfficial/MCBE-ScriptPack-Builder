/**
 * @fileoverview 格式化工具函数
 */

import { CONSOLE_COLORS } from '../constants/configs.js'

/**
 * 删除多行文本的公共缩进
 * @param {string} text - 要处理的文本
 * @returns {string} 处理后的文本
 */
export function dedent (text) {
  // 将模板字符串转换为普通字符串
  text = String(text)

  // 查找每行开头的空白字符
  const matches = text.match(/^[ \t]*(?=\S)/gm)

  if (!matches) {
    return text
  }

  // 找出最小的缩进长度
  const indent = Math.min(...matches.map(x => x.length))

  if (indent === 0) {
    return text
  }

  // 创建删除缩进的正则表达式
  const re = new RegExp(`^[ \\t]{${indent}}`, 'gm')

  return text.replace(re, '')
}

/**
 * 为文本添加颜色
 * @param {string} text - 要添加颜色的文本
 * @param {string} color - 颜色代码
 * @returns {string} 添加颜色后的文本
 */
export function colorize (text, color) {
  return `${color}${text}${CONSOLE_COLORS.RESET}`
}

/**
 * 居中对齐文本
 * @param {string} text - 要居中的文本
 * @param {number} width - 总宽度
 * @returns {string} 居中后的文本
 */
export function centerText (text, width = process.stdout.columns) {
  const padding = Math.max(0, Math.floor((width - text.length) / 2))
  return ' '.repeat(padding) + text
}

/**
 * 格式化命令行参数帮助文本
 * @param {Object} options - 命令行选项配置
 * @returns {string} 格式化后的帮助文本
 */
export function formatCommandHelp (options) {
  const lines = []
  const maxLength = Math.max(...Object.keys(options).map(key => key.length))

  for (const [key, desc] of Object.entries(options)) {
    const padding = ' '.repeat(maxLength - key.length + 4)
    lines.push(`    ${key}${padding}${desc}`)
  }

  return lines.join('\n')
}

/**
 * 格式化版本号
 * @param {Array<number>} version - 版本号数组
 * @returns {string} 格式化后的版本号
 */
export function formatVersion (version) {
  return version.join('.')
}

/**
 * 创建进度条文本
 * @param {number} current - 当前进度
 * @param {number} total - 总进度
 * @param {number} width - 进度条宽度
 * @returns {string} 进度条文本
 */
export function createProgressBar (current, total, width = 20) {
  const progress = Math.min(Math.max(current / total, 0), 1)
  const filled = Math.round(width * progress)
  const empty = width - filled

  return [
    '[',
    '='.repeat(filled),
    empty > 0 ? '>' : '',
    ' '.repeat(Math.max(0, empty - 1)),
    ']',
        ` ${Math.round(progress * 100)}%`
  ].join('')
}

/**
 * 格式化错误消息
 * @param {Error} error - 错误对象
 * @returns {string} 格式化后的错误消息
 */
export function formatError (error) {
  return colorize(`Error: ${error.message}`, CONSOLE_COLORS.RED)
}

/**
 * 格式化成功消息
 * @param {string} message - 成功消息
 * @returns {string} 格式化后的成功消息
 */
export function formatSuccess (message) {
  return colorize(`✔ ${message}`, CONSOLE_COLORS.GREEN)
}

/**
 * 格式化警告消息
 * @param {string} message - 警告消息
 * @returns {string} 格式化后的警告消息
 */
export function formatWarning (message) {
  return colorize(`⚠ ${message}`, CONSOLE_COLORS.YELLOW)
}
