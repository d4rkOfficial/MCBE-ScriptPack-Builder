# MCBE-ScriptPack-Builder

这是一个用于创建Minecraft服务器项目的脚手架工具。它可以帮助您快速创建一个新的Minecraft基岩版脚本包项目，并自动安装所需的依赖项。所生成的脚本包项目可结合Vscode插件[Minecraft Debugger](https://marketplace.visualstudio.com/items?itemName=mojang-studios.minecraft-debugger)，支持TypeScript开发，支持`@minecraft/vanilla-data`模块。


参见：[官方开发者文档](https://learn.microsoft.com/en-us/minecraft/creator/documents/scriptinggettingstarted?view=minecraft-bedrock-stable)

## 快速开始
要使用此脚手架工具，请：

确保您已经安装了Node.js（推荐Node20以上）。如果没有，请从[此链接](https://nodejs.org/) 下载并安装。

操作系统：Windows10以上。推荐使用Vscode。

### 创建脚本包
使用以下命令
```sh
npx mcbespb
```

接下来会询问您项目具体信息，其中`name`、`desc`、`auth`、`uuid1`、`uuid2`、`uuid3`、`uuid4`可以通过带参指定。
询问您的四个uuid依次是 资源包uuid、资源包模块uuid、行为包uuid、行为包模块uuid，用来确保您的工程对于游戏来说是独一无二的，默认是随机生成的。
```
✔ Name: test
✔ Desc: test
✔ Author: test
✔ UUID(Rp): 383a9e67-02d3-488d-8758-7dc48ad6568b
...
```

```sh
# 带参指定脚本包基本信息
npx mcbespb --name MyScriptPack --desc "Hello, world" --auth Steve
```

创建完成后，按照指引，输入
```sh
cd "你的脚本项目"
npm i
powershell Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### 开发、测试和打包相关

#### 把脚本包推入Minecraft

终端打开你的脚本项目目录，运行以下命令
```sh
npm run local-deploy
```

这将会使用一个叫做[just-scripts](https://microsoft.github.io/just/scripts/)的构建工具，自动编译你项目中的TypeScript，并且推入Minecraft基岩版客户端。

现在打开Minecraft，创建一个世界，在这之前，在行为包界面勾选刚才你创建的脚本包。


如果你没有修改，那么，`scripts/main.ts`作为脚本项目的默认入口文件，其内容应该是：
```ts
import * as mc from "@minecraft/server"

function mainTick() {
    if (mc.system.currentTick % 100 === 0) {
        mc.world.sendMessage("Hello, world! @tick: " + mc.system.currentTick)
    }

    mc.system.run(mainTick)
}

mc.system.run(mainTick)
```

现在打开你创建的世界，每100tick，消息栏就会显示一条`Hello, world! @tick: 当前tick`的消息，这说明代码已经跑起来了，恭喜！

#### 开始写代码
为了一边开发，一边测试，可以输入：
```sh
npm run local-deploy -- --watch
```

或者
```sh
npm run watch
```

这将监听你对脚本包的改动，并且自动推入你的Minecraft和开发存档中，如果你需要在游戏内重新加载你写好的新内容，在游戏内输入以下命令（需要作弊模式）：
```sh
/reload
```

#### 其他
整理源代码，使用以下命令
```sh
npm run lint
```

构建静态文件，使用以下命令
```sh
npm run build
```

清理中间产物文件，使用以下命令
```sh

npm run clean
```

打包成`.mcaddon`文件，使用以下命令
```sh
npm run mcaddon
```
