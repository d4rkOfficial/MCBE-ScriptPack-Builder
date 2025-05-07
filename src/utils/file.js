/**
 * @fileoverview 文件操作工具函数
 */

import fs from 'fs/promises'
import path from 'path'
import { PNG } from 'pngjs'
import { ICON_CONFIG } from '../constants/configs.js'

/**
 * 确保目录存在，如果不存在则创建
 * @param {string} dirPath - 目录路径
 * @returns {Promise<void>}
 */
export async function ensureDir (dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true })
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error
    }
  }
}

/**
 * 创建随机颜色的图标
 * @returns {Buffer} PNG图片的Buffer
 */
export function createRandomIcon () {
  const packIcon = new PNG({
    width: ICON_CONFIG.WIDTH,
    height: ICON_CONFIG.HEIGHT
  })

  packIcon.data = [
    Math.floor(Math.random() * 256), // R
    Math.floor(Math.random() * 256), // G
    Math.floor(Math.random() * 256), // B
    ICON_CONFIG.ALPHA // A
  ]

  return PNG.sync.write(packIcon)
}

/**
 * 写入JSON文件
 * @param {string} filePath - 文件路径
 * @param {Object} data - 要写入的数据
 * @returns {Promise<void>}
 */
export async function writeJsonFile (filePath, data) {
  await fs.writeFile(
    filePath,
    JSON.stringify(data, null, 4)
  )
}

/**
 * 创建项目基础目录结构
 * @param {string} projectPath - 项目根目录路径
 * @param {string} packName - 包名称
 * @returns {Promise<void>}
 */
export async function createProjectStructure (projectPath, packName) {
  const dirs = [
    path.join(projectPath, '.vscode'),
    path.join(projectPath, 'resource_packs', packName),
    path.join(projectPath, 'behavior_packs', packName),
    path.join(projectPath, 'scripts')
  ]

  await Promise.all(dirs.map(dir => ensureDir(dir)))
}

/**
 * 写入文本文件
 * @param {string} filePath - 文件路径
 * @param {string} content - 文件内容
 * @param {Object} [replacements] - 需要替换的变量
 * @returns {Promise<void>}
 */
export async function writeTextFile (filePath, content, replacements = {}) {
  let finalContent = content

  // 替换模板中的变量
  for (const [key, value] of Object.entries(replacements)) {
    finalContent = finalContent.replace(
      new RegExp(`{${key}}`, 'g'),
      value
    )
  }

  await fs.writeFile(filePath, finalContent.trim())
}

/**
 * 创建包图标
 * @param {string} resourcePath - 资源包路径
 * @param {string} behaviorPath - 行为包路径
 * @returns {Promise<void>}
 */
export async function createPackIcons (resourcePath, behaviorPath) {
  const iconData = createRandomIcon()
  await Promise.all([
    fs.writeFile(path.join(resourcePath, 'pack_icon.png'), iconData),
    fs.writeFile(path.join(behaviorPath, 'pack_icon.png'), iconData)
  ])
}

/**
 * 检查文件是否存在
 * @param {string} filePath - 文件路径
 * @returns {Promise<boolean>}
 */
export async function fileExists (filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

/**
 * 读取JSON文件
 * @param {string} filePath - 文件路径
 * @returns {Promise<Object>}
 */
export async function readJsonFile (filePath) {
  const content = await fs.readFile(filePath, 'utf8')
  return JSON.parse(content)
}
