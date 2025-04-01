/**
 * @fileoverview 多语言消息常量定义
 */

import { platform } from 'node:os'
import { execSync } from 'node:child_process'

// 支持的语言代码
export const SUPPORTED_LANGUAGES = {
    EN: 'en',
    CN: 'cn',
    JP: 'jp',
    KR: 'kr'
}

// 英文消息
const EN_MESSAGES = {
    HELP_TITLE: "MCBE Script Pack Builder",
    HELP_USAGE: "usage: mcbespb [ -v | --version ] [ -h | --help ]\n               [ [<arg1> [<value1>]] ... [<argN> [<valueN>]] ]",
    HELP_DESCRIPTION: "These are all optional arguments:\n(if necessary, if one is absent, we will inquire you via CLI)",
    HELP_PACK_INFO: `Initialize pack basic info:
    --name    Name of the pack
    --desc    Description of the pack
    --uuid1   The unique ID of your pack (resource) to be recognized by the game,
              if ungiven, we will automatically generate one.
    --uuid2   Same as above.
    --uuid3   The unique ID of your pack (behavior) to be recognized by the game,
              if ungiven, we will automatically generate one.
    --uuid4   Same as above.
    --author  The author, your name, email address, or something,
              if ungiven, we will let it be 'unknown'.
    --lang    Specify interface language (available: cn, en, jp, kr)
              If not provided, will use system language.`,
    HELP_EXIT: "> press enter to exit. <",
    VERSION_INFO: "MCBE Script Pack Builder v1.1.0",
    
    PROMPT_NAME: "Name:",
    PROMPT_DESC: "Description:",
    PROMPT_AUTHOR: "Author:",
    PROMPT_UUID_RESOURCE: "UUID(resource):",
    PROMPT_UUID_MODULE: "UUID(module):",
    PROMPT_UUID_BEHAVIOR: "UUID(behavior):",
    PROMPT_UUID_SCRIPT: "UUID(script):",
    PROMPT_USE_LATEST: "Use Latest Dependencies?",
    PROMPT_CONFIRM: "Is that ok?",
    
    PROGRESS_GET_DEPS: "Getting versions of dependencies...",
    PROGRESS_SUCCESS: "✔ Successfully getting versions of dependencies!",
    
    VERSION_SELECT_SERVER: "@minecraft/server version:",
    VERSION_SELECT_UI: "@minecraft/server-ui version:",
    VERSION_SELECT_GAMETEST: "@minecraft/server-gametest version:",
    VERSION_SELECT_DATA: "@minecraft/vanilla-data version:",
    VERSION_AUTO: "  (automatically)",
    VERSION_MANUAL: "  (manually)",
    
    COMPLETE_MESSAGE: "Now run:",
    COMPLETE_COMMANDS: "    cd {name}\n    npm i\n    powershell Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass"
}

// 中文消息
const ZH_MESSAGES = {
    HELP_TITLE: "MCBE 脚本包生成器",
    HELP_USAGE: "用法: mcbespb [ -v | --version ] [ -h | --help ]\n              [ [<参数1> [<值1>]] ... [<参数N> [<值N>]] ]",
    HELP_DESCRIPTION: "以下都是可选参数：\n(如果需要但未提供，我们会通过命令行询问)",
    HELP_PACK_INFO: `初始化包的基本信息：
    --name    包的名称
    --desc    包的描述
    --uuid1   资源包的唯一标识符，用于游戏识别，
              如果未提供，我们会自动生成。
    --uuid2   同上。
    --uuid3   行为包的唯一标识符，用于游戏识别，
              如果未提供，我们会自动生成。
    --uuid4   同上。
    --author  作者信息，可以是你的名字、邮箱或其他，
              如果未提供，将使用'unknown'。
    --lang    指定界面语言 (可选值: cn, en, jp, kr)
              如果未提供，将根据系统语言自动选择。`,
    HELP_EXIT: "> 按回车键退出 <",
    VERSION_INFO: "MCBE 脚本包生成器 v1.1.0",
    
    PROMPT_NAME: "名称：",
    PROMPT_DESC: "描述：",
    PROMPT_AUTHOR: "作者：",
    PROMPT_UUID_RESOURCE: "UUID(资源包)：",
    PROMPT_UUID_MODULE: "UUID(模块)：",
    PROMPT_UUID_BEHAVIOR: "UUID(行为包)：",
    PROMPT_UUID_SCRIPT: "UUID(脚本)：",
    PROMPT_USE_LATEST: "使用最新依赖版本？",
    PROMPT_CONFIRM: "确认这些设置？",
    
    PROGRESS_GET_DEPS: "正在获取依赖版本信息...",
    PROGRESS_SUCCESS: "✔ 成功获取依赖版本信息！",
    
    VERSION_SELECT_SERVER: "@minecraft/server 版本：",
    VERSION_SELECT_UI: "@minecraft/server-ui 版本：",
    VERSION_SELECT_GAMETEST: "@minecraft/server-gametest 版本：",
    VERSION_SELECT_DATA: "@minecraft/vanilla-data 版本：",
    VERSION_AUTO: "  (自动选择)",
    VERSION_MANUAL: "  (手动选择)",
    
    COMPLETE_MESSAGE: "现在运行：",
    COMPLETE_COMMANDS: "    cd {name}\n    npm i\n    powershell Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass"
}

// 日语消息
const JA_MESSAGES = {
    HELP_TITLE: "MCBE スクリプトパックビルダー",
    HELP_USAGE: "使用法: mcbespb [ -v | --version ] [ -h | --help ]\n                [ [<引数1> [<値1>]] ... [<引数N> [<値N>]] ]",
    HELP_DESCRIPTION: "これらはすべてオプションの引数です：\n(必要な場合、省略された場合はCLIで問い合わせます)",
    HELP_PACK_INFO: `パックの基本情報を初期化：
    --name    パックの名前
    --desc    パックの説明
    --uuid1   ゲームで認識されるパック（リソース）の一意のID、
              指定がない場合は自動生成されます。
    --uuid2   同上。
    --uuid3   ゲームで認識されるパック（ビヘイビア）の一意のID、
              指定がない場合は自動生成されます。
    --uuid4   同上。
    --author  作者、名前、メールアドレスなど、
              指定がない場合は'unknown'になります。
    --lang    インターフェース言語を指定 (選択可能: cn, en, jp, kr)
              指定がない場合、システム言語を使用します。`,
    HELP_EXIT: "> Enterキーを押して終了 <",
    VERSION_INFO: "MCBE スクリプトパックビルダー v1.1.0",
    
    PROMPT_NAME: "名前：",
    PROMPT_DESC: "説明：",
    PROMPT_AUTHOR: "作者：",
    PROMPT_UUID_RESOURCE: "UUID(リソース)：",
    PROMPT_UUID_MODULE: "UUID(モジュール)：",
    PROMPT_UUID_BEHAVIOR: "UUID(ビヘイビア)：",
    PROMPT_UUID_SCRIPT: "UUID(スクリプト)：",
    PROMPT_USE_LATEST: "最新の依存関係を使用しますか？",
    PROMPT_CONFIRM: "これらの設定でよろしいですか？",
    
    PROGRESS_GET_DEPS: "依存関係のバージョンを取得中...",
    PROGRESS_SUCCESS: "✔ 依存関係のバージョンの取得に成功しました！",
    
    VERSION_SELECT_SERVER: "@minecraft/server バージョン：",
    VERSION_SELECT_UI: "@minecraft/server-ui バージョン：",
    VERSION_SELECT_GAMETEST: "@minecraft/server-gametest バージョン：",
    VERSION_SELECT_DATA: "@minecraft/vanilla-data バージョン：",
    VERSION_AUTO: "  (自動)",
    VERSION_MANUAL: "  (手動)",
    
    COMPLETE_MESSAGE: "次を実行してください：",
    COMPLETE_COMMANDS: "    cd {name}\n    npm i\n    powershell Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass"
}

// 韩语消息
const KO_MESSAGES = {
    HELP_TITLE: "MCBE 스크립트 팩 빌더",
    HELP_USAGE: "사용법: mcbespb [ -v | --version ] [ -h | --help ]\n               [ [<인수1> [<값1>]] ... [<인수N> [<값N>]] ]",
    HELP_DESCRIPTION: "다음은 모두 선택적 인수입니다：\n(필요한 경우, 없으면 CLI를 통해 문의합니다)",
    HELP_PACK_INFO: `팩 기본 정보 초기화:
    --name    팩의 이름
    --desc    팩의 설명
    --uuid1   게임에서 인식할 팩(리소스)의 고유 ID,
              제공되지 않으면 자동으로 생성됩니다.
    --uuid2   위와 동일.
    --uuid3   게임에서 인식할 팩(동작)의 고유 ID,
              제공되지 않으면 자동으로 생성됩니다.
    --uuid4   위와 동일.
    --author  작성자, 이름, 이메일 주소 등,
              제공되지 않으면 'unknown'이 됩니다.
    --lang    인터페이스 언어 지정 (선택 가능: cn, en, jp, kr)
              지정하지 않으면 시스템 언어를 사용합니다.`,
    HELP_EXIT: "> 종료하려면 엔터 키를 누르세요 <",
    VERSION_INFO: "MCBE 스크립트 팩 빌더 v1.1.0",
    
    PROMPT_NAME: "이름：",
    PROMPT_DESC: "설명：",
    PROMPT_AUTHOR: "작성자：",
    PROMPT_UUID_RESOURCE: "UUID(리소스)：",
    PROMPT_UUID_MODULE: "UUID(모듈)：",
    PROMPT_UUID_BEHAVIOR: "UUID(동작)：",
    PROMPT_UUID_SCRIPT: "UUID(스크립트)：",
    PROMPT_USE_LATEST: "최신 종속성을 사용하시겠습니까?",
    PROMPT_CONFIRM: "이 설정이 맞습니까?",
    
    PROGRESS_GET_DEPS: "종속성 버전을 가져오는 중...",
    PROGRESS_SUCCESS: "✔ 종속성 버전을 성공적으로 가져왔습니다!",
    
    VERSION_SELECT_SERVER: "@minecraft/server 버전：",
    VERSION_SELECT_UI: "@minecraft/server-ui 버전：",
    VERSION_SELECT_GAMETEST: "@minecraft/server-gametest 버전：",
    VERSION_SELECT_DATA: "@minecraft/vanilla-data 버전：",
    VERSION_AUTO: "  (자동)",
    VERSION_MANUAL: "  (수동)",
    
    COMPLETE_MESSAGE: "이제 실행하세요：",
    COMPLETE_COMMANDS: "    cd {name}\n    npm i\n    powershell Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass"
}

// 语言代码映射
const LANGUAGE_MAPPING = {
    [SUPPORTED_LANGUAGES.EN]: EN_MESSAGES,
    [SUPPORTED_LANGUAGES.CN]: ZH_MESSAGES,
    [SUPPORTED_LANGUAGES.JP]: JA_MESSAGES,
    [SUPPORTED_LANGUAGES.KR]: KO_MESSAGES
}

/**
 * 获取系统语言
 * @returns {string} 系统语言代码
 */
function getSystemLanguage() {
    try {
        if (platform() === 'win32') {
            const stdout = execSync('powershell -command "[System.Threading.Thread]::CurrentThread.CurrentUICulture.Name"')
            return stdout.toString().trim().toLowerCase()
        } else {
            return process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL || 'en-us'
        }
    } catch {
        return 'en-us'
    }
}

/**
 * 获取语言消息
 * @param {string} langCode - 语言代码
 * @returns {Object} 对应语言的消息对象
 */
export function getLanguageMessages(langCode) {
    // 如果提供了有效的语言代码，直接使用
    if (langCode && LANGUAGE_MAPPING[langCode.toLowerCase()]) {
        return LANGUAGE_MAPPING[langCode.toLowerCase()]
    }

    // 否则根据系统语言选择
    const systemLang = getSystemLanguage()
    if (systemLang.startsWith('zh')) {
        return ZH_MESSAGES
    } else if (systemLang.startsWith('ja')) {
        return JA_MESSAGES
    } else if (systemLang.startsWith('ko')) {
        return KO_MESSAGES
    } else {
        return EN_MESSAGES
    }
}

// 导出消息对象
export const CLI_MESSAGES = getLanguageMessages(process.argv.find(arg => arg.startsWith('--lang='))?.split('=')[1])
