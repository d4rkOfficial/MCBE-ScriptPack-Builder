import { osLocale } from 'os-locale'
import * as c from 'kolorist'
import dedent from 'dedent'

let strings = {
	help_text: '',
	err_juxtaposed_two_tags: '',
  no_pack_name: ''
}

switch ((await osLocale()).trim()) {
	case 'zh-CN':
		strings = {
			help_text: dedent`
        ${c.green('我的世界脚本包构建器')} ${c.lightGreen('帮助：')}
          ${c.lightYellow('# 用法1：mcbespb')}
            - 使用命令行交互生成脚本包
          ${c.lightYellow('# 用法2：mcbespb [<参数名> <参数>]... ')}
            - 使用一行命令搭配参数的形式生成脚本包
            - 例: ${c.lightGray(
							'mcbespb --name 我的脚本包 --desc 这是我的脚本包'
						)}
          ${c.lightYellow('# 以下是所有参数：')}
            ${c.lightCyan('--name -n')}
              脚本包的名字（必填），不填你妈就死了
            ${c.lightCyan('--desc -d')}
              脚本包的简介（选填），默认留空
            ${c.lightCyan('--lang -l')}
              脚本包的编程语言（选填），可填写'js'、'ts'，默认为'js'
            ${c.lightCyan('--vers -v')}
              我的世界版本（选填），默认为脚本引擎支持的最新版本
            ${c.lightCyan('--entr -e')}
              脚本执行入口（选填），默认为'scripts/index.js'
            ${c.lightCyan('--auth -a')}
              脚本包作者（选填），默认为'Unknown'
            ${c.lightCyan('--uuid -u')}
              UUID（选填），默认随机生成
        `,
			err_juxtaposed_two_tags: c.red('请勿并列两个参数标签！'),
		}
		break

	default:
		strings = {
			help_text: dedent`
        ${c.green('Minecraft Script Pack Builder')} ${c.lightGreen('Help：')}
          ${c.lightYellow('# Usage 1：mcbespb')}
            - Build a script pack with CLI prompts
          ${c.lightYellow('# Usage 2：mcbespb [<param-name> <value>]... ')}
            - Build a script pack in one line of command with inline params
            - Example: ${c.lightGray(
							'mcbespb --name my_pack --desc "This is my pack."'
						)}
          ${c.lightYellow('# All parameters:')}
            ${c.lightCyan('--name -n')}
              Name of the pack (must)
            ${c.lightCyan('--desc -d')}
              Description of the pack (optional), nothing by default
            ${c.lightCyan('--lang -l')}
              Programming Language (optional), 'js' or 'ts', 'js' by default
            ${c.lightCyan('--vers -v')}
              Minecraft Version (optional), the latest by default
            ${c.lightCyan('--entr -e')}
              Script Entry (optioal), 'scripts/index.js' by default
            ${c.lightCyan('--auth -a')}
              Author (optional), 'Unknown' by default
            ${c.lightCyan('--uuid -u')}
              UUID (optional), random by default
        `,
			err_juxtaposed_two_tags: c.red(
				'Please do not have two param-tags juxtaposed!'
			),
		}
}

export default strings
