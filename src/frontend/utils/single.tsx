import React from 'react'

import DEFAULT_BACKGROUND from 'src/assets/images/thumbnail.svg'
import {
    CaseTool,
    TextSort,
    SymbolAlignment,
    Gist,
    TweetEmbed,
    AboutItem,
} from 'src/frontend/components'
// import { Post } from 'src/types'

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
const attrs = (text: string) => {
    const named: any = {}
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
    const pattern = /([\w-]+)\s*=\s*"([^"]*)"(?:\s|$)|([\w-]+)\s*=\s*'([^']*)'(?:\s|$)|([\w-]+)\s*=\s*([^\s'"]+)(?:\s|$)|"([^"]*)"(?:\s|$)|'([^']*)'(?:\s|$)|(\S+)(?:\s|$)/g

    // Map zero-width spaces to actual spaces.
    text = text.replace(/[\u00a0\u200b]/g, ' ').replace(/(\r\n|\n|\r)/gm, ' ')

    let match
    let innerContent = ''

    // Match and normalize attributes.
    // tslint:disable:no-conditional-assignment
    /* eslint-disable no-cond-assign */
    while ((match = pattern.exec(text))) {
        const baseMatch = match[0].trim()
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
        } else if (
            baseMatch.length > 3 &&
            baseMatch === match[9] &&
            (baseMatch.endsWith(`"/]`) || baseMatch.endsWith(`"]`))
        ) {
            const newMatch =
                /([\w-]+)\s*=\s*"([^"]*)"\/*\]$/g.exec(baseMatch) || []
            if (newMatch[1]) {
                named[newMatch[1].toLowerCase()] = newMatch[2]
            }
        } else if (match[9]) {
            numeric.push(match[9])
        }

        if (!innerContent && baseMatch.endsWith(`"]`)) {
            innerContent = ' '
        } else if (innerContent && !baseMatch.startsWith(`[/`)) {
            innerContent += match[0]
        } else if (innerContent && baseMatch.startsWith(`[/`)) {
            named['innerContent'] = innerContent
            innerContent = ''
        }
    }
    // tslint:enable:no-conditional-assignment
    /* eslint-enable no-cond-assign */

    return { named, numeric }
}

const addQueryArgs = (url: string, args: UrlArgs) => {
    const parsed = new URL(url)
    Object.keys(args).map((key) => parsed.searchParams.append(key, args[key]))
    return `${parsed.protocol}//${parsed.host}${parsed.pathname}${parsed.search}${parsed.hash}`
}

const replaceQuotes = (matched: any, key: string) => {
    const regex = /(&#8221;|&#8243;|\/\])/g
    return (matched[key] && matched[key].replace(regex, '')) || ''
}

export function parseContent(content: string): JSX.Element[] {
    const patternShortcode = /(\[([\w-]+)[^\]]*?\][^\2]*?\[\/[^\]]*\2\]|\[[\w-]+[^\]]*?\/\])/gi
    // const str = `
    // <p>[about-item from="2016" to="2018"]</p>
    // test
    // <p>[/about-item]</p>
    // <p>[dev-tools id="text-sort" /]</p>
    // <p>[dev-tools id="text-sort"/]</p>
    // `
    const str = content

    let matched: any = {}
    const splited = (str.split(patternShortcode) || [])
        .filter((v) => v)
        .filter((v) => v !== 'about-item')

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
