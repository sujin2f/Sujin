import {
    OnLoadingComplete,
    PlaceholderValue,
    StaticImport,
} from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'
import { ReactNode } from 'react'
import Caption from './Caption'
import Picture, { type ImageMap } from './Picture'
/* Helpers */
import { joinClassNames } from '../../utils/string'

type Props = {
    readonly src: string | StaticImport
    readonly alt: string
    readonly width: number | `${number}`
    readonly height?: number | `${number}`
    readonly fill?: boolean
    readonly quality?: number | `${number}`
    readonly priority?: boolean
    readonly loading?: 'eager' | 'lazy' | undefined
    readonly placeholder?: PlaceholderValue
    readonly blurDataURL?: string
    readonly unoptimized?: boolean
    readonly overrideSrc?: string
    readonly onLoadingComplete?: OnLoadingComplete
    readonly layout?: string
    readonly objectFit?: string
    readonly objectPosition?: string
    readonly lazyBoundary?: string
    readonly lazyRoot?: string
    readonly caption?: ReactNode
    readonly center?: boolean
    readonly sources?: ImageMap[]
    readonly className?: string
}

/**
 * Image component that wraps Next.js Image with additional props and features.
 *
 * @param {string | StaticImport} props.src - The source of the image.
 * @param {string} props.alt - The alt text for the image.
 * @param {number | `${number}`} [props.width] - The width of the image.
 * @param {number | `${number}`} [props.height] - The height of the image.
 * @param {boolean} [props.fill] - Whether the image should fill its container.
 * @param {number | `${number}`} [props.quality] - The quality of the image.
 * @param {boolean} [props.priority] - Whether the image should be prioritized.
 * @param {'eager' | 'lazy'} [props.loading] - The loading strategy for the image.
 * @param {PlaceholderValue} [props.placeholder] - The placeholder strategy for the image.
 * @param {string} [props.blurDataURL] - The blur data URL for the image.
 * @param {boolean} [props.unoptimized] - Whether the image should be unoptimized.
 * @param {string} [props.overrideSrc] - The override source for the image.
 * @param {OnLoadingComplete} [props.onLoadingComplete] - The callback when the image loading is complete.
 * @param {string} [props.layout] - The layout strategy for the image.
 * @param {string} [props.objectFit] - The object-fit CSS property for the image.
 * @param {string} [props.objectPosition] - The object-position CSS property for the image.
 * @param {string} [props.lazyBoundary] - The lazy boundary for the image.
 * @param {string} [props.lazyRoot] - The lazy root for the image.
 * @param {ReactNode} [props.caption] - The caption for the image.
 * @param {boolean} [props.center] - Whether the image should be centered.
 * @param {ImageMap} [props.sources] - Image-map
 * @param {string} [props.className] - class name
 */
export const NextImage = ({
    src,
    alt,
    width,
    height,
    fill,
    quality,
    priority,
    loading,
    placeholder,
    blurDataURL,
    unoptimized,
    overrideSrc,
    onLoadingComplete,
    layout,
    objectFit,
    objectPosition,
    lazyBoundary,
    lazyRoot,
    caption,
    center,
    sources,
    className: clsName,
}: Props) => {
    const className = joinClassNames(
        'image__container',
        center && 'image__container--center',
        clsName,
    )
    const img = (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            fill={fill}
            quality={quality}
            priority={priority}
            loading={loading}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            unoptimized={unoptimized}
            overrideSrc={overrideSrc}
            onLoadingComplete={onLoadingComplete}
            layout={layout}
            objectFit={objectFit}
            objectPosition={objectPosition}
            lazyBoundary={lazyBoundary}
            lazyRoot={lazyRoot}
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

export default NextImage
