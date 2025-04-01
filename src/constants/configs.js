/**
 * @fileoverview 配置常量定义
 */

export const DEFAULT_CONFIG = {
    // 默认作者
    DEFAULT_AUTHOR: "unknown",
    
    // 版本相关
    DEFAULT_VERSION: [1, 0, 0],
    FORMAT_VERSION: 2,
    
    // 文件路径相关
    PATHS: {
        SCRIPTS: "scripts",
        RESOURCE_PACKS: "resource_packs",
        BEHAVIOR_PACKS: "behavior_packs",
        VSCODE: ".vscode",
        MAIN_SCRIPT: "scripts/main.ts",
    },
    
    // 依赖包名称
    DEPENDENCIES: {
        SERVER: "@minecraft/server",
        SERVER_UI: "@minecraft/server-ui",
        SERVER_GAMETEST: "@minecraft/server-gametest",
        VANILLA_DATA: "@minecraft/vanilla-data"
    },
    
    // 文件名
    FILE_NAMES: {
        MANIFEST: "manifest.json",
        PACK_ICON: "pack_icon.png",
        MAIN_SCRIPT: "main.ts",
        ENV: ".env",
        PRETTIER_CONFIG: ".prettierrc.json",
        ESLINT_CONFIG: "eslint.config.mjs",
        JUST_CONFIG: "just.config.ts",
        PACKAGE_JSON: "package.json",
        VSCODE_EXTENSIONS: "extensions.json",
        VSCODE_LAUNCH: "launch.json",
        VSCODE_SETTINGS: "settings.json",
        VSCODE_TASKS: "tasks.json"
    }
}

export const MANIFEST_TYPES = {
    RESOURCE: "resources",
    SCRIPT: "script"
}

export const SCRIPT_CONFIG = {
    LANGUAGE: "javascript",
    ENTRY_POINT: "scripts/main.js"
}

export const VALIDATION = {
    UUID_REGEX: /^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/,
    MIN_ENGINE_VERSION_REGEX: /^\s*\d+\s*\.\s*\d+\s*\.\s*\d+\s*$/
}

export const PROGRESS_BAR = {
    TOTAL_STEPS: 3,
    SLEEP_TIME: 500
}

export const ICON_CONFIG = {
    WIDTH: 1,
    HEIGHT: 1,
    ALPHA: 255
}

export const CONSOLE_COLORS = {
    GREEN: "\x1b[32m",
    CYAN: "\x1b[36m",
    MAGENTA: "\x1b[35m",
    RESET: "\x1b[0m",
    HIDDEN: "\x1b[49m\x1b[38;5;232m"
}
