# MCBE-ScriptPack-Builder

MCBE-ScriptPack-Builder 是一款用于创建 Minecraft 基岩版服务器项目的脚手架工具。它旨在帮助您快速生成新的脚本包项目，并自动安装所需的依赖项。所创建的脚本包项目可以与 Vscode 插件 [Minecraft Debugger](https://marketplace.visualstudio.com/items?itemName=mojang-studios.minecraft-debugger) 结合使用，并支持 TypeScript 开发。默认情况下，项目将引入 `@minecraft/vanilla-data` 模块（官方提供，包含各种原版实体、方块、药效和物品的类型 ID）。

有关更多信息，请参见[官方开发者文档](https://learn.microsoft.com/en-us/minecraft/creator/documents/scriptinggettingstarted?view=minecraft-bedrock-stable)。

## 快速开始

要使用此脚手架工具，请确保您已经安装了 Node.js（推荐使用 Node 20 或更高版本）。如果没有安装，请从[Node.js 官网](https://nodejs.org/)下载并安装。

**操作系统要求**：Windows 10 及以上版本。推荐使用 Visual Studio Code（Vscode）。

### 创建脚本包

使用以下命令启动脚手架工具：

```sh
npx mcbespb
```

接下来，您将被询问项目的具体信息，包括 `name`、`desc`、`auth`、`uuid1`、`uuid2`、`uuid3`、`uuid4`。其中，`uuid1`、`uuid2`、`uuid3` 和 `uuid4` 分别对应资源包的 UUID、资源包模块的 UUID、行为包的 UUID 和行为包脚本模块的 UUID，以确保您的项目在游戏中具有唯一性。默认情况下，这些 UUID 将随机生成。

示例输入：
```
✔ Name: test
✔ Desc: test
✔ Author: test
✔ UUID(Rp): 383a9e67-02d3-488d-8758-7dc48ad6568b
...
```

您也可以通过命令行参数指定脚本包的基本信息：
```sh
npx mcbespb --name MyScriptPack --desc "Hello, world" --auth Steve
```

创建完成后，请按照指引，输入以下命令以进入项目目录并安装依赖：
```sh
cd "你的脚本项目"
npm install
powershell Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 开发、测试和打包

#### 推送脚本包到 Minecraft

在终端中打开您的脚本项目目录，运行以下命令：
```sh
npm run local-deploy
```

此命令将使用 [just-scripts](https://microsoft.github.io/just/scripts/) 构建工具，自动编译项目中的 TypeScript 代码，并将其推送到 Minecraft 基岩版客户端。

打开 Minecraft，创建一个新世界并在行为包界面勾选刚才创建的脚本包。

如果您未修改项目内容，则 `scripts/main.ts` 将作为默认入口文件，其内容应如下所示：
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

在您创建的世界中，每经过 100 tick，消息栏将显示一条 `Hello, world! @tick: 当前tick` 的消息，说明代码已成功运行，恭喜您！

#### 开始写代码

在开发过程中，您可以使用以下命令进行实时测试：
```sh
npm run local-deploy -- --watch
```
或
```sh
npm run watch
```

这将监控脚本包的更改并自动将其推送到您的 Minecraft 开发存档中。若需要在游戏内重新加载已修改的内容，请在游戏中输入以下命令（需启用作弊模式）：
```sh
/reload
```

#### 其他功能

- **整理源代码**：使用以下命令
    ```sh
    npm run lint
    ```

- **构建静态文件**：使用以下命令
    ```sh
    npm run build
    ```

- **清理中间产物文件**：使用以下命令
    ```sh
    npm run clean
    ```

- **打包为 `.mcaddon` 文件**：使用以下命令
    ```sh
    npm run mcaddon
    ```
```
