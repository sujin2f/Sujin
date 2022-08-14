import React from 'react'

import DEFAULT_BACKGROUND from 'src/assets/images/thumbnail.svg'
import { Gist } from 'src/frontend/components/Gist'
import { TweetEmbed } from 'src/frontend/components/TweetEmbed'
import { AboutItem } from 'src/frontend/components/AboutItem'
import { Carousel } from 'src/frontend/components/Carousel'
import { CaseTool } from 'src/frontend/components/dev-tool/CaseTool'
import { SymbolAlignment } from 'src/frontend/components/dev-tool/SymbolAlignment'
import { TextSort } from 'src/frontend/components/dev-tool/TextSort'

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

type Named = Record<string, string>
type AttrMatch = { named: Named; numeric: string[] }
/**
 * Parse shortcode attributes.
 * @param {string} text Serialised shortcode attributes.
 *
 * @return {any} Parsed shortcode attributes.
 */
const attrs = (text: string): AttrMatch => {
    const named: Record<string, string> = {}
    const numeric = []

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
    /* eslint-disable no-cond-assign */
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
    /* eslint-enable no-cond-assign */

    const patternShortcode =
        /(\[([\w-]+)[^\]]*?\]([^\2]*)?\[\/[^\]]*\2\]|\[[\w-]+[^\]]*?\/\])/gi
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

const replaceQuotes = (matched: Named, key: string) => {
    const regex = /(&#8221;|&#8243;|\/\])/g
    return (matched[key] && matched[key].replace(regex, '')) || ''
}

export function parseContent(content: string): JSX.Element[] {
    const patternShortcode =
        /(\[([\w-]+)[^\]]*?\][^\2]*?\[\/[^\]]*\2\]|\[[\w-]+[^\]]*?\/\])/gi
    const str = content

    let matched: {
        [key: string]: AttrMatch
    } = {}
    const splited = (str.split(patternShortcode) || [])
        .filter((v) => v)
        .filter((v) => v !== 'about-item' && v !== 'caption')

    matched = (str.match(regexp('gist')) || []).reduce(
        (acc, value) => ({
            ...acc,
            [value]: attrs(value),
        }),
        matched,
    )

    matched = (str.match(regexp('tweet')) || []).reduce(
        (acc, value) => ({
            ...acc,
            [value]: attrs(value),
        }),
        matched,
    )

    matched = (str.match(regexp('dev-tools')) || []).reduce(
        (acc, value) => ({
            ...acc,
            [value]: attrs(value),
        }),
        matched,
    )

    matched = (str.match(regexp('about-item')) || []).reduce(
        (acc, value) => ({
            ...acc,
            [value]: attrs(value),
        }),
        matched,
    )

    matched = (str.match(regexp('caption')) || []).reduce(
        (acc, value) => ({
            ...acc,
            [value]: attrs(value),
        }),
        matched,
    )

    matched = (str.match(regexp('carousel')) || []).reduce(
        (acc, value) => ({
            ...acc,
            [value]: attrs(value),
        }),
        matched,
    )

    const elements = splited.map((value, index) => {
        if (matched[value]) {
            if (value.indexOf('[gist') === 0) {
                const id = replaceQuotes(matched[value].named, 'id')
                const file = replaceQuotes(matched[value].named, 'file')

                return (
                    <Gist
                        id={id}
                        file={file}
                        key={`content-element__gist__${id}__${index}`}
                    />
                )
            }

            if (value.indexOf('[tweet') === 0) {
                const id = replaceQuotes(matched[value].named, 'id')
                return (
                    <TweetEmbed
                        id={id}
                        key={`content-element__tweet__${id}__${index}`}
                    />
                )
            }

            if (value.indexOf('[caption') === 0) {
                const align = replaceQuotes(matched[value].named, 'align')
                const innerContent = replaceQuotes(
                    matched[value].named,
                    'innerContent',
                )
                const alignClass =
                    align === 'aligncenter' ? 'caption--align-center' : ''

                return (
                    <div
                        id="attachment_14308"
                        className={`caption ${alignClass}`}
                        key={`content-element__caption__${index}`}
                        dangerouslySetInnerHTML={{ __html: innerContent }}
                    ></div>
                )
            }

            if (value.indexOf('[dev-tools') === 0) {
                const id = replaceQuotes(matched[value].named, 'id')
                switch (id) {
                    case 'text-sort':
                        return (
                            <TextSort
                                key={`content-element__text-sort__${index}`}
                            />
                        )
                    case 'symbol-alignment':
                        return (
                            <SymbolAlignment
                                key={`content-element__text-sort__${index}`}
                            />
                        )
                    case 'case-tool':
                    default:
                        return (
                            <CaseTool
                                key={`content-element__case-tool__${index}`}
                            />
                        )
                }
            }

            if (value.indexOf('[about-item') === 0) {
                const from = replaceQuotes(matched[value].named, 'from')
                const to = replaceQuotes(matched[value].named, 'to')
                const innerContent = replaceQuotes(
                    matched[value].named,
                    'innerContent',
                )

                return (
                    <AboutItem
                        key={`content-element__about-item__${index}`}
                        from={from}
                        to={to}
                        content={innerContent}
                    />
                )
            }

            if (value.indexOf('[carousel') === 0) {
                const images: string[] = Object.keys(matched[value].named)
                    .filter((key) => key.match(/sc[0-9]+/))
                    .map((key) => matched[value].named[key])

                return (
                    <Carousel
                        images={images}
                        key={`content-element__carousel__${index}`}
                    />
                )
            }
        }

        return (
            <div
                dangerouslySetInnerHTML={{ __html: value }}
                key={`content-element__section__${index}`}
            />
        )
    })

    return elements
}

// export function parseSeries(
//     id: number,
//     seriesPosts?: SimplePost[],
// ): StateLeftRail {
//     if (!seriesPosts || seriesPosts.length === 0) {
//         return {}
//     }

//     return {
//         Series: {
//             ...seriesPosts.reduce((acc, series: SimplePost) => {
//                 return {
//                     ...acc,
//                     [series.title]: series.link,
//                 }
//             }, {}),
//         },
//     }
// }

const getNewWindowFeatures = (): string => {
    const top = (window.innerHeight - 600) / 2
    const left = (window.innerWidth - 500) / 2
    return `toolbar=0,status=0,resizable=yes,width=500,height=600,top=${top},left=${left}`
}

export const shareTwitter = (text: string): void => {
    const url = addQueryArgs('https://www.twitter.com/intent/tweet', {
        text,
        url: window.location.href,
    })

    window.open(url, 'Twitter', getNewWindowFeatures())
}

export const shareFacebook = (
    title: string,
    excerpt: string,
    thumbnail: string,
): void => {
    const url = addQueryArgs('https://www.facebook.com/sharer/sharer.php', {
        u: window.location.href,
        picture: thumbnail || DEFAULT_BACKGROUND,
        text: (title && encodeURIComponent(title)) || '',
        quote: (excerpt && encodeURIComponent(excerpt)) || '',
    })

    window.open(url, 'Facebook', getNewWindowFeatures())
}
