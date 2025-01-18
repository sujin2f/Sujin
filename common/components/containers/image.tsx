import {
    OnLoadingComplete,
    PlaceholderValue,
    StaticImport,
} from 'next/dist/shared/lib/get-img-props'
import NextImage from 'next/image'
import { ReactNode } from 'react'
import { className as getClassName } from '@common/utils/string'

type Props = {
    src: string | StaticImport
    alt: string
    width?: number | `${number}`
    height?: number | `${number}`
    fill?: boolean
    quality?: number | `${number}`
    priority?: boolean
    loading?: 'eager' | 'lazy' | undefined
    placeholder?: PlaceholderValue
    blurDataURL?: string
    unoptimized?: boolean
    overrideSrc?: string
    onLoadingComplete?: OnLoadingComplete
    layout?: string
    objectFit?: string
    objectPosition?: string
    lazyBoundary?: string
    lazyRoot?: string
    readonly caption?: ReactNode
    readonly center?: boolean
}

export const Image = ({
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
}: Props) => {
    const className = getClassName(
        'image__container',
        center && 'image__container--center',
    )
    return (
        <div className={className}>
            <div className="image">
                <NextImage
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
            </div>
            {caption && (
                <div className="caption">
                    <div className="caption__text">{caption}</div>
                </div>
            )}
        </div>
    )
}
