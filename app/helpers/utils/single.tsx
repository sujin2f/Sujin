import React, { Fragment, JSX, createElement } from 'react'

/* Components */
import { Gist } from '@app/components/single/Gist'
import { TweetEmbed } from '@app/components/single/TweetEmbed'
import { AboutItem } from '@app/components/single/AboutItem'
import { Carousel } from '@app/components/single/Carousel'
import { Caption } from '@app/components/single/Caption'
import { Code } from '@app/components/single/Code'
/* Helpers */
import type { Named, AttrMatch } from '@app/helpers/types/wordpress'
import { FACEBOOK_SHARE, TWITTER_SHARE } from '@app/helpers/constants/system'

interface UrlArgs {
    [key: string]: string
}

/**
 * Generate a RegExp to identify a shortcode.
 *
 * @param {string} tag Shortcode tag.
 *
 * @return {RegExp} Shortcode RegExp.
 */
const regexp = (tag: string): RegExp => {
    return new RegExp(
        '\\[(\\[?)(' +
            tag +
            ')(?![\\w-])([^\\]\\/]*(?:\\/(?!\\])[^\\]\\/]*)*?)(?:(\\/)\\]|\\](?:([^\\[]*(?:\\[(?!\\/\\2\\])[^\\[]*)*)(\\[\\/\\2\\]))?)(\\]?)',
        'g',
    )
}

/**
 * Parse shortcode attributes.
 * @param {string} text Serialised shortcode attributes.
 *
 * @return {any} Parsed shortcode attributes.
 */
const attrs = (text: string): AttrMatch => {
    const named: Record<string, string> = {}
    const numeric: string[] = []

    // This regular expression is reused from `shortcode_parse_atts()` in
    // `wp-includes/shortcodes.php`.
    //
    // Capture groups:
    //
    // 1. An attribute name, that corresponds to...
    // 2. a value in double quotes.
    // 3. An attribute name, that corresponds to...
    // 4. a value in single quotes.
    // 5. An attribute name, that corresponds to...
    // 6. an unquoted value.
    // 7. A numeric attribute in double quotes.
    // 8. A numeric attribute in single quotes.
    // 9. An unquoted numeric attribute.
    const patterns = [
        /([\w-]+)\s*=\s*"([^"]*)"(?:\s|]|$)/, // name="value"
        /([\w-]+)\s*=\s*'([^']*)'(?:\s|]|$)/, // name='value'
        /([\w-]+)\s*=\s*([^\s'"]+)(?:\s|]|$)/, // name=value
        /"([^"]*)"(?:\s|]|$)/, // ""
        /'([^']*)'(?:\s|]|$)/, // ''
        /(\S+)(?:\s|]|$)/,
    ]
    const pattern = new RegExp(patterns.map((reg) => reg.source).join('|'), 'g')

    // Map zero-width spaces to actual spaces.
    text = text.replace(/[\u00a0\u200b]/g, ' ')

    let match

    // Match and normalize attributes.
    // tslint:disable:no-conditional-assignment

    while ((match = pattern.exec(text))) {
        if (match[1]) {
            named[match[1].toLowerCase()] = match[2]
        } else if (match[3]) {
            named[match[3].toLowerCase()] = match[4]
        } else if (match[5]) {
            named[match[5].toLowerCase()] = match[6]
        } else if (match[7]) {
            numeric.push(match[7])
        } else if (match[8]) {
            numeric.push(match[8])
        } else if (match[9]) {
            numeric.push(match[9])
        }
    }
    // tslint:enable:no-conditional-assignment

    const patternShortcode =
        /(\[([\w-]+)[^\]]*?\]([^\x02]*)?\[\/[^\]]*\2\]|\[[\w-]+[^\]]*?\/\])/gi
    const shortcodeMatch = patternShortcode.exec(text)
    if (shortcodeMatch && shortcodeMatch[3]) {
        named.innerContent = shortcodeMatch[3]
    }
    return { named, numeric }
}

const addQueryArgs = (url: string, args: UrlArgs) => {
    const parsed = new URL(url)
    Object.keys(args).map((key) => parsed.searchParams.append(key, args[key]))
    return `${parsed.protocol}//${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`
}

export const replaceQuotes = (matched: Named, key: string) => {
    const regex = /(&#8221;|&#8243;|\/\])/g
    return (matched[key] && matched[key].replace(regex, '')) || ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shortcodes: Record<string, (prop: any) => JSX.Element> = {
    gist: Gist,
    tweet: TweetEmbed,
    'about-item': AboutItem,
    caption: Caption,
    carousel: Carousel,
    code: Code,
}

export function parseContent(content: string): JSX.Element[] {
    const patternShortcode =
        /(\[([\w-]+)[^\]]*?\][^\x02]*?\[\/[^\]]*\2\]|\[[\w-]+[^\]]*?\/\])/gi
    const str = content

    const matched: {
        [key: string]: AttrMatch
    } = {}
    const splitted = (str.split(patternShortcode) || [])
        .filter((v) => v)
        .filter((v) => v !== 'about-item' && v !== 'caption' && v !== 'code')
    const keys = Object.keys(shortcodes)

    keys.forEach((shortcode) => {
        ;(str.match(regexp(shortcode)) || []).forEach((value) => {
            matched[value] = attrs(value)
        })
    })
    const elements = splitted.map((value, index) => {
        if (matched[value]) {
            for (let i = 0; i < keys.length; i++) {
                if (value.indexOf(`[${keys[i]}`) === 0) {
                    return createElement(shortcodes[keys[i]], {
                        key: `content-element__${i}__${index}`,
                        value: matched[value],
                    })
                }
            }
        }

        const section = removeExtraParagraph(value)

        if (section) {
            return (
                <div
                    dangerouslySetInnerHTML={{
                        __html: section,
                    }}
                    key={`content-element__section__${index}`}
                />
            )
        }
        return <Fragment key={`content-element__section__${index}`} />
    })

    return elements
}

export const removeExtraParagraph = (value: string) => {
    return value
        .replace(/<p>$/, '')
        .replace(/^<\/p>/, '')
        .replace('/n', '')
        .trim()
}

const getNewWindowFeatures = (): string => {
    const top = (window.innerHeight - 600) / 2
    const left = (window.innerWidth - 500) / 2
    return `toolbar=0,status=0,resizable=yes,width=500,height=600,top=${top},left=${left}`
}

export const shareTwitter = (path: string, text: string): void => {
    const url = addQueryArgs(TWITTER_SHARE, {
        text,
        url: path,
    })

    window.open(url, 'Twitter', getNewWindowFeatures())
}

export const shareFacebook = (
    path: string,
    title: string,
    excerpt: string,
    thumbnail: string,
): void => {
    const url = addQueryArgs(FACEBOOK_SHARE, {
        u: path,
        picture: thumbnail,
        text: title && encodeURIComponent(title),
        quote: excerpt && encodeURIComponent(excerpt),
    })

    window.open(url, 'Facebook', getNewWindowFeatures())
}
