import type { PropsWithChildren, ReactNode } from 'react'
/* Helpers */
import { joinClassNames } from '@sujin/share/utils/string'

type Props = {
    readonly caption: ReactNode
    readonly center?: boolean
}

/**
 * Image component that wraps Next.js Image with additional props and features.
 *
 * @param {boolean} [props.center] - Whether the image should be centered.
 * @param {ReactNode} [props.caption] - The caption for the image.
 */
const Caption = ({ caption, center, children }: PropsWithChildren<Props>) => {
    const className = joinClassNames(
        'image__container',
        center && 'image__container--center',
    )
    return (
        <figure className={className}>
            <div className="image">{children}</div>
            <div className="caption">
                <div className="caption__text">{caption}</div>
            </div>
        </figure>
    )
}

export default Caption
