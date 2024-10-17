import { input } from "@inquirer/prompts"

/**
 * @private
 * @const {string}
 * @description Version information displayed for the script pack builder.
 */
const versionText = `MCBE Script Pack Builder v1.1.0
`

/**
 * Displays the version information and waits for user input to exit.
 * @public
 * @returns {Promise<void>} A promise that resolves when user input is received.
 */
export default async function printVersion() {
    process.stdout.write(versionText)
    return input({ message: "\x1b[49m\x1b[38;5;232m", required: false })
}
