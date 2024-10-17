import { input } from "@inquirer/prompts"

/**
 * @private
 * @const {string}
 * @description Help text displayed for the script pack builder.
 */
const helpText = `\x1b[32m${center("MCBE Script Pack Builder")}
\x1b[36m
usage: mcbespb [ -v | --version ] [ -h | --help ]
               [ [<arg1> [<value1>]] ... [<argN> [<valueN>]] ]
\x1b[0m
These are all optional arguments:
(if necessary, if one is absent, we will inquire you via CLI)

Initialize pack basic info:
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

${center("> press enter to exit. <")}
`

/**
 * Centers the text within a specified maximum length.
 * @private
 * @param {string} inputText - The text to center.
 * @param {number} [maxWidth=30] - The maximum width in which to center the text.
 * @returns {string} The centered text.
 */
function center(inputText, maxWidth = 30) {
    const paddingLength = Math.min(process.stdout.columns / 2, maxWidth) - inputText.length / 2
    return `${" ".repeat(paddingLength)}${inputText}`
}

/**
 * Prints the help text and waits for user input to exit.
 * @public
 * @returns {Promise<void>} A promise that resolves when user input is received.
 */
export default async function printHelp() {
    process.stdout.write(helpText)
    await input({ message: "\x1b[49m\x1b[38;5;232m", required: false })
}
