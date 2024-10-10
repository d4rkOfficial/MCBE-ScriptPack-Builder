/**
 * @public
 * @class ProgressBar
 */
export default class ProgressBar {
    LINE_LENGTH = 50
    progress = [0, 1]
    hintText = ""
    placeholder = ""

    constructor(hintText = "", placeholder = "▇") {
        this.placeholder = placeholder
        this.setHintText(hintText)
    }

    setProgress(current = 0, max = 0) {
        this.progress = [current, max]
        this.render()
    }

    setHintText(text = "") {
        this.hintText = text
        this.render()
    }

    render() {
        process.stdout.write("\r\r")
        process.stdout.write("\x1b[2K")

        let barLength = Math.min(process.stdout.columns, this.LINE_LENGTH) - String(this.hintText).length - 2
        let placeholder1 = `\x1b[32m${this.placeholder}\x1b[0m`.repeat(
            this.progress[0] !== 0 ? barLength * (this.progress[0] / this.progress[1]) : 0,
        )
        let placeholder2 = `${this.placeholder}`.repeat(
            barLength - (this.progress[0] !== 0 ? barLength * (this.progress[0] / this.progress[1]) : 0),
        )

        process.stdout.write(`\x1b[1m${this.hintText}  \x1b[22m${placeholder1}${placeholder2}`)
    }

    close(message = "") {
        process.stdout.write("\r\r")
        process.stdout.write("\x1b[2K")
        if (message.trim()) {
            process.stdout.write(`\x1b[1m${message}\n\x1b[22m`)
        }
    }

    /**
     * @static
     * @param {(setProgress: typeof ProgressBar.prototype.setProgress, setHintText: typeof ProgressBar.prototype.setHintText, close: typeof ProgressBar.prototype.close, sleep: (ms: number) => Promise<void>) => void | Promise<void>} listener
     */
    static listen(listener) {
        const progressBar = new ProgressBar()
        return listener(
            (...args) => progressBar.setProgress(...args),
            (...args) => progressBar.setHintText(...args),
            (...args) => progressBar.close(...args),
            (ms) => new Promise((r) => setTimeout(r, ms)),
        )
    }
}
