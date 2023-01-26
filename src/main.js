import prompts from 'prompts'
import * as COLOR from 'kolorist'
import { randomUUID } from 'node:crypto'
import { execSync as exec } from 'node:child_process'
import { mkdirSync as mkdir, writeFileSync as writeFile } from 'node:fs'
import { resolve as resolvePath } from 'node:path'

const colors = ['red', 'yellow', 'green', 'cyan', 'blue', 'magenta']
let charIndex = 0
process.stdout.write(Array
  .from(' -- MinecraftBE Script Pack Builder -- ')
  .map(char => {
    if (!char === ' ') return ' '
    if (charIndex === 6) charIndex = 0
    return COLOR[colors[charIndex++]](char)
  })
  .reduce((acc, cur) => acc + cur, '') + '\n'
)

const res = await prompts([

  {
    type: 'text',
    name: 'pack_name',
    message: COLOR.lightGreen('Package name? '),
    initial: 'My_Script_Pack'
  },

  {
    type: 'select',
    name: 'game_version',
    message: COLOR.lightGreen('MinecraftBE version? '),
    initial: 0,
    choices: [
      {
        title: '1.19.60-beta+',
        value: [[1, 19, 0], true]
      },
      {
        title: '1.19.x',
        value: [[1, 19, 0], true]
      },
      {
        title: '1.18.x',
        value: [[1, 18, 0], false]
      },
      {
        title: '1.17.x',
        value: [[1, 17, 0], false]
      },
      {
        title: '1.16.210.x',
        value: [[1, 16, 210], false]
      }
      // @todo: update version list
    ]
  },

  {
    type: 'text',
    name: 'pack_desc',
    message: COLOR.lightGreen('Description: '),
    initial: 'My_Description'
  },

  {
    type: 'text',
    name: 'pack_uuid',
    message: COLOR.lightGreen('UUID: '),
    initial: randomUUID(),
    validate (uuid) {
      return /[1234567890abcdef]{8}(-[1234567890abcdef]{4}){3}-[1234567890abcdef]{12}/
        .test(uuid.trim())
    }
  },

  {
    type: 'select',
    name: 'language',
    message: COLOR.lightGreen('Programing language? '),
    choices: [
      { title: COLOR.lightYellow('JavaScript'), value: 'js' },
      { title: COLOR.lightBlue('TypeScript'), value: 'ts' }
    ]
  },

  {
    type: 'multiselect',
    name: 'modules',
    message: COLOR.lightGreen('Select modules to require.'),
    hint: '- Space to select. Enter to confirm.',
    instructions: false,
    choices: [
      {
        title: COLOR.bgLightRed(COLOR.white('@minecraft/server')),
        value: ['@minecraft/server', '1.1.0-beta']
      },
      {
        title: COLOR.bgYellow(COLOR.white('@minecraft/server-gametest')),
        value: ['@minecraft/server-gametest', '1.0.0-beta']
      },
      {
        title: COLOR.bgLightGreen(COLOR.white('@minecraft/server-ui')),
        value: ['@minecraft/server-ui', '1.0.0-beta']
      },
      {
        title: COLOR.bgLightCyan(COLOR.white('@minecraft/server-admin')),
        value: ['@minecraft/server-admin', '1.0.0-beta']
      },
      {
        title: COLOR.bgMagenta(COLOR.white('@minecraft/server-net')),
        value: ['@minecraft/server-net', '1.0.0-beta']
      }
    ]
  },

  {
    type: 'list',
    name: 'pack_vers',
    message: COLOR.lightGreen('Pack version? '),
    initial: '1.0.0',
    separator: '.'
  },

  {
    type: 'text',
    name: 'author',
    message: COLOR.lightGreen('Author: ')
  },

  {
    type: 'text',
    name: 'entry',
    message: COLOR.lightGreen('Entry:') + COLOR.lightGray('scripts/'),
    initial: 'index.js'
  }

], { onCancel: abort })

const { ok } = await prompts({
  type: 'toggle',
  name: 'ok',
  message: COLOR.lightYellow('Is it okay?'),
  initial: true,
  active: 'Yes',
  inactive: 'No'
})

if (!ok) abort()
if (!res.game_version[1]) abort('This game version is not supported!')

process.stdout.write('\n' + COLOR.lightCyan('- Please wait...'))

try {
  mkdir(resolvePath(res.pack_name))
  mkdir(resolvePath(res.pack_name, 'pack'))
  mkdir(resolvePath(res.pack_name, 'pack', 'scripts'))

  writeFile(resolvePath(res.pack_name, 'package.json'), JSON.stringify({
    name: res.pack_name,
    version: '1.0.0',
    author: res.author,
    description: res.pack_desc,
    type: 'module',
    scripts: {
      build: res.language === 'js' // or else: ts
        ? `npx zip -q -r ${res.pack_name}.mcpack pack`
        : `npx tsc && npx zip -q -x pack/scripts/*.ts -r ${res.pack_name}.mcpack pack`
    }
  }, null, 2))

  writeFile(resolvePath(res.pack_name, 'pack', 'manifest.json'), JSON.stringify({
    format_version: 2,
    header: {
      name: res.pack_name,
      description: res.pack_desc,
      uuid: res.pack_uuid,
      version: res.pack_vers.map(Number),
      min_engine_version: res.game_version[0]
    },
    modules: [
      {
        description: res.pack_desc,
        type: 'script',
        language: 'javascript',
        uuid: randomUUID(),
        version: [0, 0, 1],
        entry: 'scripts/' + res.entry
      }
    ],
    dependencies: (() => res.modules.map(mod => ({
      module_name: mod[0],
      version: mod[1]
    })))()
  }, null, 2))

  writeFile(resolvePath(res.pack_name, 'pack', 'scripts', res.language === 'js' ? res.entry : res.entry.replace(/\.js$/, '.ts')), [
    "import * as Server from '@minecraft/server'",
    'Server.world.events.worldInitialize.subscribe(() => {',
    "  Server.world.say('Hello, world!')",
    '})'
  ].join('\n'))
  exec(`npm install ${res.modules.reduce((acc, cur) => acc + cur[0] + '@beta ', '')} --save-dev`, {
    cwd: resolvePath(res.pack_name)
  })

  if (res.language === 'ts') {
    const tsconfig = JSON.stringify({
      compilerOptions: {
        target: 'esnext',
        module: 'esnext',
        moduleResolution: 'nodenext',
        strict: false
      },
      include: [
        'pack/scripts'
      ]
    }, null, 2)// @todo
    exec(`echo '${tsconfig}' > tsconfig.json`, {
      cwd: resolvePath(res.pack_name)
    })
  }
} catch (err) {
  abort(err)
}

process.exit(0)

function abort (reason) {
  process.stdout.write('\n' + COLOR.lightRed(' -- Aborted! -- ') + '\n')
  if (reason) throw reason
  process.exit(1)
}
