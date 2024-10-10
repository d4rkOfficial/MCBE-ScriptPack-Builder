import { input } from "@inquirer/prompts"

/**
 * @private
 * @const
 */
const VERSION_TEXT = `MCBE Script Pack Builder v1.1.0
`

/**
 * @public
 * @function printVersion
 */
export default async function printVersion() {
    process.stdout.write(VERSION_TEXT)
    return input({ message: "\x1b[49m\x1b[38;5;232m", required: false })
}
