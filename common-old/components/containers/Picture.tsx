import type { PropsWithChildren } from 'react'

export type ImageMap = {
    src: string
    media: string
    mimeType?: string
    width?: number
    height?: number
}

type Props = {
    sources: ImageMap[]
    className?: string
}

/**
 * Picture component for responsible image
 *
 * @param {boolean} [props.className] - HTML class attribute
 * @param {ImageMap} [props.sources] - Image-map
 */
const Picture = ({
    sources,
    className,
    children,
}: PropsWithChildren<Props>) => {
    return (
        <picture className={`image__container__picture ${className}`}>
            {sources.map((source, index) => (
                <source
                    key={`source-${source.src}-${index}`}
                    type={source.mimeType}
                    media={source.media}
                    srcSet={source.src}
                    width={source.width}
                    height={source.height}
                />
            ))}
            {children}
        </picture>
    )
}

export default Picture
