/**
 * Removes leading indentation from template strings.
 * @param {string | string[]} templates - The template string(s) to process.
 * @param  {...any} values - Values to interpolate into the template.
 * @returns {string} - The resulting string after dedenting.
 */
export default function dedent(templates, ...values) {
    let strings = typeof templates === "string" ? [templates] : [...templates]

    const minIndentation = strings.reduce((minIndent, str) => {
        const trimmedStr = str.trim()
        const match = trimmedStr.match(/^\n*(\s+)/)
        if (match && trimmedStr.length > 0) {
            return Math.min(minIndent, match[1].length)
        }
        return minIndent
    }, Infinity)

    const minIndentRegExp = new RegExp(`^\\s{${minIndentation}}`, "mg")

    const unindentedStrs = strings.map((str, index) => {
        if (index === 0) {
            return str.trimStart().replace(minIndentRegExp, "")
        }
        return str.replace(minIndentRegExp, "")
    })

    let result = unindentedStrs[0]
    for (let i = 0; i < values.length; i++) {
        result += values[i] + (unindentedStrs[i + 1] || "")
    }

    return result
}
