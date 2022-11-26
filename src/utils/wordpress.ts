const PHPUnserialize = require('php-unserialize')

/**
 * The regular expression for an HTML element.
 *
 * @type {RegExp}
 */
const htmlSplitRegex = (() => {
    /* eslint-disable no-multi-spaces */
    const comments =
        '!' + // Start of comment, after the <.
        '(?:' + // Unroll the loop: Consume everything until --> is found.
        '-(?!->)' + // Dash not followed by end of comment.
        '[^\\-]*' + // Consume non-dashes.
        ')*' + // Loop possessively.
        '(?:-->)?' // End of comment. If not found, match all input.

    const cdata =
        '!\\[CDATA\\[' + // Start of comment, after the <.
        '[^\\]]*' + // Consume non-].
        '(?:' + // Unroll the loop: Consume everything until ]]> is found.
        '](?!]>)' + // One ] not followed by end of comment.
        '[^\\]]*' + // Consume non-].
        ')*?' + // Loop possessively.
        '(?:]]>)?' // End of comment. If not found, match all input.

    const escaped =
        '(?=' + // Is the element escaped?
        '!--' +
        '|' +
        '!\\[CDATA\\[' +
        ')' +
        '((?=!-)' + // If yes, which type?
        comments +
        '|' +
        cdata +
        ')'

    const regex =
        '(' + // Capture the entire match.
        '<' + // Find start of element.
        '(' + // Conditional expression follows.
        escaped + // Find end of escaped element.
        '|' + // ... else ...
        '[^>]*>?' + // Find end of normal element.
        ')' +
        ')'

    return new RegExp(regex)
    /* eslint-enable no-multi-spaces */
})()

/**
 * Separate HTML elements and comments from the text.
 *
 * @param {string} input The text which has to be formatted.
 *
 * @return {string[]} The formatted text.
 */
const htmlSplit = (input: string): string[] => {
    const parts = []
    let workingInput = input

    let match
    while ((match = workingInput.match(htmlSplitRegex))) {
        // The `match` result, when invoked on a RegExp with the `g` flag (`/foo/g`) will not include `index`.
        // If the `g` flag is omitted, `index` is included.
        // `htmlSplitRegex` does not have the `g` flag so we can assert it will have an index number.
        // Assert `match.index` is a number.
        const index = /** @type {number} */ match.index || 0

        parts.push(workingInput.slice(0, index))
        parts.push(match[0])
        workingInput = workingInput.slice(index + match[0].length)
    }

    if (workingInput.length) {
        parts.push(workingInput)
    }

    return parts
}

/**
 * Replace characters or phrases within HTML elements only.
 *
 * @param {string}                haystack     The text which has to be formatted.
 * @param {Record<string,string>} replacePairs In the form {from: 'to', …}.
 *
 * @return {string} The formatted text.
 */
const replaceInHtmlTags = (
    haystack: string,
    replacePairs: Record<string, string>,
): string => {
    // Find all elements.
    const textArr = htmlSplit(haystack)
    let changed = false

    // Extract all needles.
    const needles = Object.keys(replacePairs)

    // Loop through delimiters (elements) only.
    for (let i = 1; i < textArr.length; i += 2) {
        for (let j = 0; j < needles.length; j++) {
            const needle = needles[j]
            if (-1 !== textArr[i].indexOf(needle)) {
                textArr[i] = textArr[i].replace(
                    new RegExp(needle, 'g'),
                    replacePairs[needle],
                )
                changed = true
                // After one strtr() break out of the foreach loop and look at next element.
                break
            }
        }
    }

    if (changed) {
        haystack = textArr.join('')
    }

    return haystack
}

/**
 * Replaces double line-breaks with paragraph elements.
 *
 * A group of regex replaces used to identify text formatted with newlines and
 * replace double line-breaks with HTML paragraph tags. The remaining line-
 * breaks after conversion become `<br />` tags, unless br is set to 'false'.
 *
 * @param {string}  text The text which has to be formatted.
 * @param {boolean} br   Optional. If set, will convert all remaining line-
 *                       breaks after paragraphing. Default true.
 *
 * @example
 *```js
 * import { autop } from '@wordpress/autop';
 * autop( 'my text' ); // "<p>my text</p>"
 * ```
 *
 * @return {string} Text which has been converted into paragraph tags.
 */
export const autop = (text: string, br = true): string => {
    const preTags = []

    if (text.trim() === '') {
        return ''
    }

    // Just to make things a little easier, pad the end.
    text = text + '\n'

    /*
     * Pre tags shouldn't be touched by autop.
     * Replace pre tags with placeholders and bring them back after autop.
     */
    if (text.indexOf('<pre') !== -1) {
        const textParts = text.split('</pre>')
        const lastText = textParts.pop()
        text = ''

        for (let i = 0; i < textParts.length; i++) {
            const textPart = textParts[i]
            const start = textPart.indexOf('<pre')

            // Malformed html?
            if (start === -1) {
                text += textPart
                continue
            }

            const name = '<pre wp-pre-tag-' + i + '></pre>'
            preTags.push([name, textPart.substr(start) + '</pre>'])

            text += textPart.substr(0, start) + name
        }

        text += lastText
    }
    // Change multiple <br>s into two line breaks, which will turn into paragraphs.
    text = text.replace(/<br\s*\/?>\s*<br\s*\/?>/g, '\n\n')

    const allBlocks =
        '(?:table|thead|tfoot|caption|col|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|form|map|area|blockquote|address|math|style|p|h[1-6]|hr|fieldset|legend|section|article|aside|hgroup|header|footer|nav|figure|figcaption|details|menu|summary)'

    // Add a double line break above block-level opening tags.
    text = text.replace(
        new RegExp('(<' + allBlocks + '[\\s/>])', 'g'),
        '\n\n$1',
    )

    // Add a double line break below block-level closing tags.
    text = text.replace(new RegExp('(</' + allBlocks + '>)', 'g'), '$1\n\n')

    // Standardize newline characters to "\n".
    text = text.replace(/\r\n|\r/g, '\n')

    // Find newlines in all elements and add placeholders.
    text = replaceInHtmlTags(text, { '\n': ' <!-- wpnl --> ' })

    // Collapse line breaks before and after <option> elements so they don't get autop'd.
    if (text.indexOf('<option') !== -1) {
        text = text.replace(/\s*<option/g, '<option')
        text = text.replace(/<\/option>\s*/g, '</option>')
    }

    /*
     * Collapse line breaks inside <object> elements, before <param> and <embed> elements
     * so they don't get autop'd.
     */
    if (text.indexOf('</object>') !== -1) {
        text = text.replace(/(<object[^>]*>)\s*/g, '$1')
        text = text.replace(/\s*<\/object>/g, '</object>')
        text = text.replace(/\s*(<\/?(?:param|embed)[^>]*>)\s*/g, '$1')
    }

    /*
     * Collapse line breaks inside <audio> and <video> elements,
     * before and after <source> and <track> elements.
     */
    if (text.indexOf('<source') !== -1 || text.indexOf('<track') !== -1) {
        text = text.replace(/([<[](?:audio|video)[^>\]]*[>\]])\s*/g, '$1')
        text = text.replace(/\s*([<[]\/(?:audio|video)[>\]])/g, '$1')
        text = text.replace(/\s*(<(?:source|track)[^>]*>)\s*/g, '$1')
    }

    // Collapse line breaks before and after <figcaption> elements.
    if (text.indexOf('<figcaption') !== -1) {
        text = text.replace(/\s*(<figcaption[^>]*>)/, '$1')
        text = text.replace(/<\/figcaption>\s*/, '</figcaption>')
    }

    // Remove more than two contiguous line breaks.
    text = text.replace(/\n\n+/g, '\n\n')

    // Split up the contents into an array of strings, separated by double line breaks.
    const texts = text.split(/\n\s*\n/).filter(Boolean)

    // Reset text prior to rebuilding.
    text = ''

    // Rebuild the content as a string, wrapping every bit with a <p>.
    texts.forEach((textPiece) => {
        text += '<p>' + textPiece.replace(/^\n*|\n*$/g, '') + '</p>\n'
    })

    // Under certain strange conditions it could create a P of entirely whitespace.
    text = text.replace(/<p>\s*<\/p>/g, '')

    // Add a closing <p> inside <div>, <address>, or <form> tag if missing.
    text = text.replace(/<p>([^<]+)<\/(div|address|form)>/g, '<p>$1</p></$2>')

    // If an opening or closing block element tag is wrapped in a <p>, unwrap it.
    text = text.replace(
        new RegExp('<p>\\s*(</?' + allBlocks + '[^>]*>)\\s*</p>', 'g'),
        '$1',
    )

    // In some cases <li> may get wrapped in <p>, fix them.
    text = text.replace(/<p>(<li.+?)<\/p>/g, '$1')

    // If a <blockquote> is wrapped with a <p>, move it inside the <blockquote>.
    text = text.replace(/<p><blockquote([^>]*)>/gi, '<blockquote$1><p>')
    text = text.replace(/<\/blockquote><\/p>/g, '</p></blockquote>')

    // If an opening or closing block element tag is preceded by an opening <p> tag, remove it.
    text = text.replace(
        new RegExp('<p>\\s*(</?' + allBlocks + '[^>]*>)', 'g'),
        '$1',
    )

    // If an opening or closing block element tag is followed by a closing <p> tag, remove it.
    text = text.replace(
        new RegExp('(</?' + allBlocks + '[^>]*>)\\s*</p>', 'g'),
        '$1',
    )

    // Optionally insert line breaks.
    if (br) {
        // Replace newlines that shouldn't be touched with a placeholder.
        text = text.replace(/<(script|style).*?<\/\\1>/g, (match) =>
            match[0].replace(/\n/g, '<WPPreserveNewline />'),
        )

        // Normalize <br>
        text = text.replace(/<br>|<br\/>/g, '<br />')

        // Replace any new line characters that aren't preceded by a <br /> with a <br />.
        text = text.replace(/(<br \/>)?\s*\n/g, (a, b) => (b ? a : '<br />\n'))

        // Replace newline placeholders with newlines.
        text = text.replace(/<WPPreserveNewline \/>/g, '\n')
    }

    // If a <br /> tag is after an opening or closing block tag, remove it.
    text = text.replace(
        new RegExp('(</?' + allBlocks + '[^>]*>)\\s*<br />', 'g'),
        '$1',
    )

    // If a <br /> tag is before a subset of opening or closing block tags, remove it.
    text = text.replace(
        /<br \/>(\s*<\/?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)/g,
        '$1',
    )
    text = text.replace(/\n<\/p>$/g, '</p>')

    // Replace placeholder <pre> tags with their original content.
    preTags.forEach((preTag) => {
        const [name, original] = preTag
        text = text.replace(name, original)
    })

    // Restore newlines in all elements.
    if (-1 !== text.indexOf('<!-- wpnl -->')) {
        text = text.replace(/\s?<!-- wpnl -->\s?/g, '\n')
    }

    return text
}

export const unserialize = <
    T extends Record<string, any> | string | number | boolean,
>(
    value: string,
    defaultValue: T,
    key?: string,
): T => {
    if (typeof value !== 'string') {
        return value
    }

    if (!value) {
        return defaultValue
    }

    if (!value.startsWith('a:') || !value.endsWith('}')) {
        return value as T
    }

    const unserialized = PHPUnserialize.unserialize(value)
    if (key) {
        if (Object.keys(unserialized).includes(key)) {
            return unserialized[key]
        }
        return defaultValue
    }
    return unserialized
}
