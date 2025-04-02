/**
 * @fileoverview 项目文件生成器
 */

import path from 'path'
import { DEFAULT_CONFIG } from '../../constants/configs.js'
import { FILE_TEMPLATES } from '../../constants/templates.js'
import { 
    createProjectStructure, 
    writeJsonFile, 
    writeTextFile, 
    createPackIcons 
} from '../../utils/file.js'
import { dedent } from '../../utils/format.js'

/**
 * @typedef {Object} ProjectConfig
 * @property {string} name - 项目名称
 * @property {string} description - 项目描述
 * @property {Object} resourceManifest - 资源包清单
 * @property {Object} behaviorManifest - 行为包清单
 * @property {string} serverVersion - @minecraft/server 版本
 * @property {string} uiVersion - @minecraft/server-ui 版本
 * @property {string} gametestVersion - @minecraft/server-gametest 版本
 * @property {string} dataVersion - @minecraft/vanilla-data 版本
 */

/**
 * 生成 VS Code 配置文件
 * @param {string} projectPath - 项目路径
 * @returns {Promise<void>}
 */
async function generateVSCodeFiles(projectPath) {
    const vscodePath = path.join(projectPath, DEFAULT_CONFIG.PATHS.VSCODE)
    
    await Promise.all([
        writeTextFile(
            path.join(vscodePath, DEFAULT_CONFIG.FILE_NAMES.VSCODE_EXTENSIONS),
            FILE_TEMPLATES.VSCODE.EXTENSIONS
        ),
        writeTextFile(
            path.join(vscodePath, DEFAULT_CONFIG.FILE_NAMES.VSCODE_LAUNCH),
            FILE_TEMPLATES.VSCODE.LAUNCH
        ),
        writeTextFile(
            path.join(vscodePath, DEFAULT_CONFIG.FILE_NAMES.VSCODE_SETTINGS),
            FILE_TEMPLATES.VSCODE.SETTINGS
        ),
        writeTextFile(
            path.join(vscodePath, DEFAULT_CONFIG.FILE_NAMES.VSCODE_TASKS),
            FILE_TEMPLATES.VSCODE.TASKS
        )
    ])
}

/**
 * 生成项目配置文件
 * @param {string} projectPath - 项目路径
 * @param {ProjectConfig} config - 项目配置
 * @returns {Promise<void>}
 */
async function generateConfigFiles(projectPath, config) {
    await Promise.all([
        writeTextFile(
            path.join(projectPath, DEFAULT_CONFIG.FILE_NAMES.ENV),
            FILE_TEMPLATES.ENV,
            { projectName: config.name }
        ),
        writeTextFile(
            path.join(projectPath, DEFAULT_CONFIG.FILE_NAMES.PRETTIER_CONFIG),
            FILE_TEMPLATES.PRETTIER_CONFIG
        ),
        writeTextFile(
            path.join(projectPath, DEFAULT_CONFIG.FILE_NAMES.ESLINT_CONFIG),
            FILE_TEMPLATES.ESLINT_CONFIG
        ),
        writeTextFile(
            path.join(projectPath, DEFAULT_CONFIG.FILE_NAMES.JUST_CONFIG),
            FILE_TEMPLATES.JUST_CONFIG
        )
    ])
}

/**
 * 生成包文件
 * @param {string} projectPath - 项目路径
 * @param {ProjectConfig} config - 项目配置
 * @returns {Promise<void>}
 */
async function generatePackFiles(projectPath, config) {
    const resourcePath = path.join(projectPath, DEFAULT_CONFIG.PATHS.RESOURCE_PACKS, config.name)
    const behaviorPath = path.join(projectPath, DEFAULT_CONFIG.PATHS.BEHAVIOR_PACKS, config.name)
    
    await Promise.all([
        // 创建清单文件
        writeJsonFile(
            path.join(resourcePath, DEFAULT_CONFIG.FILE_NAMES.MANIFEST),
            config.resourceManifest
        ),
        writeJsonFile(
            path.join(behaviorPath, DEFAULT_CONFIG.FILE_NAMES.MANIFEST),
            config.behaviorManifest
        ),
        // 创建图标文件
        createPackIcons(resourcePath, behaviorPath)
    ])
}

/**
 * 生成脚本文件
 * @param {string} projectPath - 项目路径
 * @returns {Promise<void>}
 */
async function generateScriptFiles(projectPath) {
    await writeTextFile(
        path.join(projectPath, DEFAULT_CONFIG.PATHS.SCRIPTS, DEFAULT_CONFIG.FILE_NAMES.MAIN_SCRIPT),
        dedent(FILE_TEMPLATES.MAIN_SCRIPT)
    )
}

/**
 * 生成 package.json 文件
 * @param {string} projectPath - 项目路径
 * @param {ProjectConfig} config - 项目配置
 * @returns {Promise<void>}
 */
async function generatePackageJson(projectPath, config) {
    await writeTextFile(
        path.join(projectPath, DEFAULT_CONFIG.FILE_NAMES.PACKAGE_JSON),
        FILE_TEMPLATES.PACKAGE_JSON,
        {
            name: config.name,
            description: config.description,
            serverVersion: config.serverVersion,
            uiVersion: config.uiVersion,
            // gametestVersion: config.gametestVersion,
            dataVersion: config.dataVersion
        }
    )
}

/**
 * 生成完整的项目文件
 * @param {ProjectConfig} config - 项目配置
 * @returns {Promise<void>}
 */
export async function generateProject(config) {
    const projectPath = path.join(process.cwd(), config.name)
    
    // 创建项目目录结构
    await createProjectStructure(projectPath, config.name)
    
    // 并行生成所有文件
    await Promise.all([
        generateVSCodeFiles(projectPath),
        generateConfigFiles(projectPath, config),
        generatePackFiles(projectPath, config),
        generateScriptFiles(projectPath),
        generatePackageJson(projectPath, config)
    ])
}
