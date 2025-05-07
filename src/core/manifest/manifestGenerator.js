/**
 * @fileoverview 清单文件生成器
 */

import { DEFAULT_CONFIG, MANIFEST_TYPES, SCRIPT_CONFIG } from '../../constants/configs.js'

/**
 * @typedef {Object} ManifestInfo
 * @property {string} name - 包名称
 * @property {string} desc - 包描述
 * @property {string} auth - 作者
 * @property {string} uuid1 - 资源包UUID
 * @property {string} uuid2 - 资源包模块UUID
 * @property {string} uuid3 - 行为包UUID
 * @property {string} uuid4 - 脚本UUID
 * @property {[number, number, number]} min_engine_version - 最小引擎版本
 * @property {string} minecraft_server_version - minecraft/server 版本
 * @property {string} minecraft_server_ui_version - minecraft/server-ui 版本
 * @deprecated @property {string} minecraft_server_gametest_version - minecraft/server-gametest 版本
 */

/**
 * 创建资源包清单
 * @param {ManifestInfo} info - 清单信息
 * @returns {Object} 资源包清单对象
 */
function createResourceManifest (info) {
  return {
    format_version: DEFAULT_CONFIG.FORMAT_VERSION,
    header: {
      name: info.name,
      description: info.desc,
      uuid: info.uuid1,
      version: DEFAULT_CONFIG.DEFAULT_VERSION,
      min_engine_version: info.min_engine_version
    },
    modules: [
      {
        description: info.desc,
        type: MANIFEST_TYPES.RESOURCE,
        uuid: info.uuid2,
        version: DEFAULT_CONFIG.DEFAULT_VERSION
      }
    ],
    dependencies: [
      {
        uuid: info.uuid3,
        version: DEFAULT_CONFIG.DEFAULT_VERSION
      }
    ]
  }
}

/**
 * 创建行为包清单
 * @param {ManifestInfo} info - 清单信息
 * @returns {Object} 行为包清单对象
 */
function createBehaviorManifest (info) {
  return {
    format_version: DEFAULT_CONFIG.FORMAT_VERSION,
    header: {
      name: info.name,
      description: info.desc,
      uuid: info.uuid3,
      version: DEFAULT_CONFIG.DEFAULT_VERSION,
      min_engine_version: info.min_engine_version
    },
    modules: [
      {
        description: 'Script resources',
        language: SCRIPT_CONFIG.LANGUAGE,
        type: MANIFEST_TYPES.SCRIPT,
        uuid: info.uuid4,
        version: DEFAULT_CONFIG.DEFAULT_VERSION,
        entry: SCRIPT_CONFIG.ENTRY_POINT
      }
    ],
    dependencies: [
      {
        module_name: DEFAULT_CONFIG.DEPENDENCIES.SERVER,
        version: [info.minecraft_server_version]
          .map((version) => {
            if (!version.includes('-') && !version.includes('stable')) {
              return version
            }
            return `${version.split('-')[0]}-beta`
          })
      },
      {
        module_name: DEFAULT_CONFIG.DEPENDENCIES.SERVER_UI,
        version: [info.minecraft_server_ui_version]
          .map((version) => {
            if (!version.includes('-') && !version.includes('stable')) {
              return version
            }
            return `${version.split('-')[0]}-beta`
          })
      },
      {
        uuid: info.uuid1,
        version: DEFAULT_CONFIG.DEFAULT_VERSION
      }
    ]
  }
}

/**
 * 创建资源包和行为包的清单文件
 * @param {ManifestInfo} info - 清单信息
 * @returns {[Object, Object]} 包含资源包和行为包清单的数组
 */
export function generateManifests (info) {
  const resourceManifest = createResourceManifest(info)
  const behaviorManifest = createBehaviorManifest(info)

  return [resourceManifest, behaviorManifest]
}

/**
 * 验证清单信息
 * @param {ManifestInfo} info - 要验证的清单信息
 * @throws {Error} 如果信息无效则抛出错误
 */
export function validateManifestInfo (info) {
  if (!info.name || typeof info.name !== 'string') {
    throw new Error('Invalid package name')
  }

  if (!info.desc || typeof info.desc !== 'string') {
    throw new Error('Invalid package description')
  }

  if (!Array.isArray(info.min_engine_version) ||
        info.min_engine_version.length !== 3 ||
        !info.min_engine_version.every(v => typeof v === 'number')) {
    throw new Error('Invalid min engine version')
  }

  // 验证所有UUID
  const uuids = [info.uuid1, info.uuid2, info.uuid3, info.uuid4]
  if (!uuids.every(uuid => typeof uuid === 'string' && uuid.length > 0)) {
    throw new Error('Invalid UUID format')
  }

  // 验证版本号
  const versions = [
    info.minecraft_server_version,
    info.minecraft_server_ui_version
  ]
  if (!versions.every(v => typeof v === 'string' && /^\d+\.\d+\.\d+/.test(v))) {
    throw new Error('Invalid dependency version format')
  }
}
