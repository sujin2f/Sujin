import {
    createElement,
    Fragment,
    type PropsWithChildren,
    type ReactNode,
} from 'react'
/* Components */
import { Gist } from '@app/(single)/_components/Gist'
import { TweetEmbed } from '@app/(single)/_components/TweetEmbed'
import { AboutItem } from '@app/(single)/_components/AboutItem'
import { Carousel } from '@app/(single)/_components/Carousel'
import { Caption } from '@app/(single)/_components/Caption'
import { Code } from '@app/(single)/_components/Code'
/* Utils */
import { removeEmptyParagraphs } from '@sujin/common/utils/string'
/* T_Types */
import type { T_Post, T_Page } from '@app/_lib/types'
import type { T_Stringify } from '@sujin/common/types/mongo'
import type { T_ShortcodeAttrMatch } from '@app/_lib/types'

type Props = {
    post: T_Stringify<T_Post | T_Page>
    type: 'page' | 'post'
}

export const Content = (props: PropsWithChildren<Props>) => {
    const {
        post: { _id, id, slug, content },
        type,
        children,
    } = props

    const contents = [...parseContent(content)]

    return (
        <>
            <article
                className={`content--${type} content--${decodeURIComponent(
                    slug,
                )} content--${type}-${id} content--${_id} content`}
            >
                {contents}
            </article>
            <footer className="content__footer">{children}</footer>
        </>
    )
}

function parseContent(content: string): ReactNode[] {
    const patternShortcode =
        /(\[([\w-]+)[^\]]*?\][^\x02]*?\[\/[^\]]*\2\]|\[[\w-]+[^\]]*?\/\])/gi
    const str = content

    const matched: {
        [key: string]: T_ShortcodeAttrMatch
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

        const section = removeEmptyParagraphs(value)

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shortcodes: Record<string, (prop: any) => ReactNode> = {
    gist: Gist,
    tweet: TweetEmbed,
    'about-item': AboutItem,
    caption: Caption,
    carousel: Carousel,
    code: Code,
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
const attrs = (text: string): T_ShortcodeAttrMatch => {
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
