/**
 * @fileoverview 主程序入口
 */

import {
  parseCommandLineArgs,
  handleHelpAndVersion,
  getProjectInfo,
  getUUIDs,
  getDependencyVersions,
  confirmConfiguration
} from './cli/commands/commandHandler.js'
import { ProgressBar } from './cli/progress/ProgressBar.js'
import { generateManifests, validateManifestInfo } from './core/manifest/manifestGenerator.js'
import { generateProject } from './core/generator/projectGenerator.js'
import { CLI_MESSAGES } from './constants/messages.js'
import { DEFAULT_CONFIG, PROGRESS_BAR } from './constants/configs.js'
import { formatSuccess } from './utils/format.js'
import getVersions from './core/version/versionFetcher.js'

/**
 * 获取依赖版本信息
 * @returns {Promise<Object>} 依赖版本信息
 */
async function fetchDependencyVersions () {
  let versions = {
    server: [],
    ui: [],
    data: []
  }

  let progressSteps = 0
  await ProgressBar.listen(async (setProgress, setHintText, complete, sleep) => {
    setHintText(CLI_MESSAGES.PROGRESS_GET_DEPS)

    // 获取各个依赖包的版本信息
    const [serverVersions, uiVersions, dataVersions] = await Promise.all([
      getVersions('@minecraft/server'),
      getVersions('@minecraft/server-ui'),
      getVersions('@minecraft/vanilla-data')
    ])

    versions = {
      server: serverVersions,
      ui: uiVersions,
      data: dataVersions
    }

    setProgress(++progressSteps, PROGRESS_BAR.TOTAL_STEPS)
    sleep(500)
    complete(CLI_MESSAGES.PROGRESS_SUCCESS)
  })

  return versions
}

/**
 * 主程序入口
 */
async function main () {
  try {
    // 解析命令行参数
    const args = parseCommandLineArgs()

    // 处理帮助和版本命令
    if (handleHelpAndVersion(args)) {
      return
    }

    // @todo 延迟

    // 获取项目基本信息
    const projectInfo = await getProjectInfo(args)

    // 获取UUID信息
    const uuidInfo = await getUUIDs(args)

    // 获取依赖版本信息
    const versions = await fetchDependencyVersions()
    const dependencyVersions = await getDependencyVersions(versions)

    // 计算最小引擎版本
    const minEngineVersion = dependencyVersions.dataVersion
      .split('-')[0]
      .split('.')
      .map((val, idx) => (idx === 2 ? 0 : Number(val)))

    // 创建清单信息
    const manifestInfo = {
      ...projectInfo,
      ...uuidInfo,
      min_engine_version: minEngineVersion,
      minecraft_server_version: dependencyVersions.serverVersion,
      minecraft_server_ui_version: dependencyVersions.uiVersion
    }

    // 验证清单信息
    validateManifestInfo(manifestInfo)

    // 生成清单文件
    const [resourceManifest, behaviorManifest] = generateManifests(manifestInfo)

    // 确认配置
    if (!await confirmConfiguration()) {
      process.exit(1)
    }

    // 生成项目文件
    await generateProject({
      name: projectInfo.name,
      description: projectInfo.desc,
      resourceManifest,
      behaviorManifest,
      serverVersion: dependencyVersions.serverVersion,
      uiVersion: dependencyVersions.uiVersion,
      dataVersion: dependencyVersions.dataVersion
    })

    // 显示完成信息
    console.log(formatSuccess(CLI_MESSAGES.COMPLETE_MESSAGE))
    console.log(CLI_MESSAGES.COMPLETE_COMMANDS.replace('{name}', projectInfo.name))
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

// 执行主程序
main()
