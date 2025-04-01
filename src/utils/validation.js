/**
 * @fileoverview 验证工具函数
 */

import { VALIDATION } from '../constants/configs.js'

/**
 * 验证UUID格式是否正确
 * @param {string} uuid - 要验证的UUID字符串
 * @returns {boolean} 是否是有效的UUID
 */
export function validateUUID(uuid) {
    return VALIDATION.UUID_REGEX.test(uuid.trim().toLowerCase())
}

/**
 * 验证引擎版本格式是否正确
 * @param {string} version - 要验证的版本字符串
 * @returns {boolean} 是否是有效的版本格式
 */
export function validateEngineVersion(version) {
    return VALIDATION.MIN_ENGINE_VERSION_REGEX.test(version)
}

/**
 * 解析版本字符串为数组
 * @param {string} version - 版本字符串 (例如: "1.2.3")
 * @returns {[number, number, number]} 版本号数组
 */
export function parseVersion(version) {
    return version.split('.').map(v => Number(v.trim()))
}

/**
 * 获取不包含预发布标记的最新版本
 * @param {string[]} versions - 版本列表
 * @returns {string} 最新的稳定版本
 */
export function getLatestStableVersion(versions) {
    return versions.find(v => !v.includes('-'))
}

/**
 * 验证项目名称
 * @param {string} name - 项目名称
 * @returns {boolean} 是否是有效的项目名称
 */
export function validateProjectName(name) {
    // 项目名称不能为空，且只能包含字母、数字、下划线和中划线
    return /^[a-zA-Z0-9_-]+$/.test(name)
}

/**
 * 验证作者名称
 * @param {string} author - 作者名称
 * @returns {boolean} 是否是有效的作者名称
 */
export function validateAuthor(author) {
    // 作者名称不能包含特殊字符（除了常见的标点符号）
    return /^[a-zA-Z0-9\s_\-.,@<>()[\]{}]+$/.test(author)
}

/**
 * 验证描述文本
 * @param {string} description - 描述文本
 * @returns {boolean} 是否是有效的描述
 */
export function validateDescription(description) {
    // 描述不能为空，且长度不能超过1000个字符
    return description.trim().length > 0 && description.length <= 1000
}