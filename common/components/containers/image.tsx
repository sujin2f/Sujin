/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from 'react'
import Caption from './Caption'
import Picture from './Picture'
import type { ImageMap } from './Picture'
/* Helpers */
import { joinClassNames } from '../../utils/string'

type Props = {
    readonly src: string
    readonly alt: string
    readonly width?: number | `${number}`
    readonly height?: number | `${number}`
    readonly caption?: ReactNode
    readonly center?: boolean
    readonly sources?: ImageMap[]
}

/**
 * Image component for HTML img
 *
 * @param {string | StaticImport} props.src - The source of the image.
 * @param {string} props.alt - The alt text for the image.
 * @param {number | `${number}`} [props.width] - The width of the image.
 * @param {number | `${number}`} [props.height] - The height of the image.
 * @param {ReactNode} [props.caption] - The caption for the image.
 * @param {boolean} [props.center] - Whether the image should be centered.
 * @param {ImageMap} [props.sources] - Image-map
 */
const Image = ({
    src,
    alt,
    width,
    height,
    caption,
    center,
    sources,
}: Props) => {
    const className = joinClassNames(
        'image__container',
        center && 'image__container--center',
    )
    const img = (
        <img
            alt={alt}
            className="banner__icon"
            width={width}
            height={height}
            src={src}
            role="presentation"
        />
    )

    if (caption) {
        return (
            <Caption caption={caption} center>
                {sources ? <Picture sources={sources}>{img}</Picture> : img}
            </Caption>
        )
    }
    return (
        <figure className={className}>
            {sources ? <Picture sources={sources}>{img}</Picture> : img}
        </figure>
    )
}

export default Image
