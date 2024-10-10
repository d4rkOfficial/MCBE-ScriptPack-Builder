import { input } from "@inquirer/prompts"

/**
 * @private
 * @const
 */
const HELP_TEXT = `\x1b[35m${center("MCBE Script Pack Builder")}
\x1b[36m
usage: mcbespb [ -v | --version ] [ -h | --help ]
               [ [<arg1> [<value1>]] ... [<argN> [<valueN>]] ]
\x1b[0m
These are all optional args:
(if nessacery one is absent, we will inquire you with cli)
\x1b[36m
Initialize pack basic info:
    --name    Name of the pack
    --desc    Description of the pack
    --uuid1   The unique id of your pack(resource) to be recognized by the game,
              if ungiven, we will automatically generate one
    --uuid2   The same as above
    --uuid3   The unique id of your pack(behaviour) to be recognized by the game,
              if ungiven, we will automatically generate one
    --uuid4   The same as above
    --author  The author, your name or e-mail address or something,
              if ungiven, we will let it be 'unknown'
\x1b[0m
Just-Scripts:
    --lint    Run eslint
    --build   Build your project
    --clean   Clean temp/, lib/, dist/
    --deploy  Deploy the pack locally
    --mcaddon Zip the pack into '.mcaddon'

\x1b[33m${center("> press enter to exit. <")}\x1b[0m
`

/**
 * @private
 * @param {string} text
 * @param {number=} maxLength
 * @returns {string}
 */
function center(text, maxLength = 30) {
    return `${" ".repeat(Math.min(process.stdout.columns / 2, maxLength) - text.length / 2)}${text}`
}

/**
 * @public
 * @function printHelp
 */
export default async function printHelp() {
    process.stdout.write(HELP_TEXT)
    return input({ message: "\x1b[49m\x1b[38;5;232m", required: false })
}
