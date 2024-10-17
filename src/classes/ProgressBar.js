/**
 * @public
 * @class ProgressBar
 * @description This class handles the rendering of a progress bar in the console.
 */
export default class ProgressBar {
    #maxBarLength = 50 // Maximum length of the progress bar.
    #currentProgress = [0, 1] // Holds the current progress and maximum progress values.
    #displayText = "" // Text to display next to the progress bar.
    #progressCharacter = "" // Character used for the progress representation.

    /**
     * Creates a new ProgressBar instance.
     * @param {string} displayText - The text to display next to the progress bar.
     * @param {string} progressCharacter - The character used to visualize the progress (default is '▇').
     */
    constructor(displayText = "", progressCharacter = "▇") {
        this.#progressCharacter = progressCharacter
        this.setDisplayText(displayText)
    }

    /**
     * Sets the current and maximum progress values.
     * @param {number} current - The current progress value.
     * @param {number} max - The maximum progress value.
     * @throws {Error} Throws an error if max is less than or equal to 0.
     */
    setProgress(current = 0, max = 0) {
        if (max <= 0) {
            throw new Error("Maximum progress must be greater than 0.")
        }

        this.#currentProgress = [Math.max(0, Math.min(current, max)), max] // Clamp current progress
        this.render()
    }

    /**
     * Sets the display text shown next to the progress bar.
     * @param {string} text - The text to be set as display text.
     */
    setDisplayText(text = "") {
        this.#displayText = text
        this.render()
    }

    /**
     * Renders the progress bar to the console.
     */
    render() {
        process.stdout.write("\r\x1b[2K") // Clear the line

        const availableBarLength = Math.min(process.stdout.columns, this.#maxBarLength) - String(this.#displayText).length - 2
        const filledLength = availableBarLength * (this.#currentProgress[0] / this.#currentProgress[1])

        const filledBar = `\x1b[32m${this.#progressCharacter}\x1b[0m`.repeat(Math.round(filledLength))
        const emptyBar = `${this.#progressCharacter}`.repeat(availableBarLength - Math.round(filledLength))

        process.stdout.write(`\x1b[1m${this.#displayText}  \x1b[22m${filledBar}${emptyBar}`)
    }

    /**
     * Closes the progress bar and optionally displays a message.
     * @param {string} message - A message to display after the progress bar is closed.
     */
    close(message = "") {
        process.stdout.write("\r\x1b[2K") // Clear the line
        if (message.trim()) {
            process.stdout.write(`\x1b[1m${message}\n\x1b[22m`)
        }
    }

    /**
     * Listens for updates and controls the progress bar.
     * @static
     * @param {(setProgress: Function, setDisplayText: Function, close: Function, sleep: Function) => void | Promise<void>} listener
     * @returns {void | Promise<void>} The result of the listener function call.
     */
    static listen(listener) {
        const progressBar = new ProgressBar()
        return listener(
            (...args) => progressBar.setProgress(...args),
            (...args) => progressBar.setDisplayText(...args),
            (...args) => progressBar.close(...args),
            (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
        )
    }
}
