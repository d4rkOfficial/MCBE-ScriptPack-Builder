# MCBE-ScriptPack-Builder

MCBE-ScriptPack-Builder 是一款专业的 Minecraft 基岩版服务器脚本开发工具。它能帮助开发者快速搭建脚本包项目框架，并自动配置开发环境。本工具生成的项目完全兼容 Visual Studio Code 的 [Minecraft Debugger](https://marketplace.visualstudio.com/items?itemName=mojang-studios.minecraft-debugger) 插件，支持 TypeScript 开发，并默认集成了 `@minecraft/vanilla-data` 模块（官方提供的原版游戏数据模块，包含实体、方块、药效和物品的类型 ID）。

想了解更多 Minecraft 基岩版脚本开发的信息，请访问[官方开发者文档](https://learn.microsoft.com/en-us/minecraft/creator/documents/scriptinggettingstarted?view=minecraft-bedrock-stable)。

## 环境要求

- **操作系统**：Windows 10 或更高版本
- **开发工具**：推荐使用 Visual Studio Code
- **运行环境**：Node.js 20.0 或更高版本（[下载地址](https://nodejs.org/)）

## 快速上手

### 创建新项目

使用以下命令启动项目创建向导：

```sh
npx mcbespb
```

向导会引导您填写以下项目信息：
- `name`：项目名称
- `desc`：项目描述
- `auth`：作者信息
- `uuid1`：资源包 UUID
- `uuid2`：资源包模块 UUID
- `uuid3`：行为包 UUID
- `uuid4`：行为包脚本模块 UUID

> 注：所有 UUID 都会自动生成，确保您的项目在游戏中具有唯一标识。您也可以提供自定义的 UUID。

您也可以通过命令行参数直接指定项目信息：
```sh
npx mcbespb --name MyScriptPack --desc "我的第一个脚本包" --auth Steve
```

### 项目初始化

创建项目后，请按顺序执行以下命令：

```sh
# 进入项目目录
cd "您的项目名称"

# 安装项目依赖
npm install

# 设置 PowerShell 执行策略（仅首次需要）
powershell Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 开发与调试

#### 部署到游戏客户端

在项目目录下执行：
```sh
npm run local-deploy
```

此命令会编译 TypeScript 代码并将脚本包部署到 Minecraft 客户端。

#### 实时开发模式

启用文件监听，代码修改后自动部署：
```sh
npm run watch
# 或
npm run local-deploy -- --watch
```

当您修改代码后，需要在游戏中重新加载脚本（需要开启作弊模式）：
```sh
/reload
```

#### 默认示例代码

项目创建后，`scripts/main.ts` 中包含一个简单的示例：
```ts
import * as mc from "@minecraft/server";

function mainTick() {
    if (mc.system.currentTick % 100 === 0) {
        mc.world.sendMessage("Hello, world! @tick: " + mc.system.currentTick);
    }
    mc.system.run(mainTick);
}

mc.system.run(mainTick);
```

此代码会每 100 个游戏刻在聊天栏显示一条消息。

### 实用命令

- **代码格式化**
  ```sh
  npm run lint
  ```

- **构建项目**
  ```sh
  npm run build
  ```

- **清理临时文件**
  ```sh
  npm run clean
  ```

- **打包成 .mcaddon**
  ```sh
  npm run mcaddon
  ```

## 测试部署

1. 运行 `npm run local-deploy` 部署脚本包
2. 启动 Minecraft，创建新世界
3. 在世界设置中启用实验性玩法和作弊模式
4. 在行为包列表中选择并启用您的脚本包
5. 进入游戏后，观察聊天栏是否每 100 tick 显示一次消息
6. 如果看到消息显示，说明部署成功！
