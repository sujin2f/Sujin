import {
    OnLoadingComplete,
    PlaceholderValue,
    StaticImport,
} from 'next/dist/shared/lib/get-img-props'
import NextImage from 'next/image'

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
}: Props) => {
    return (
        <div className="flex flex--center">
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
    )
}
