import { replaceQuotes } from '@app/_lib/utils/wordpress'
import type { T_ShortcodeAttrMatch } from '@sujin/lib/types'
import { default as NextImage } from 'next/image'

interface Props {
    value: T_ShortcodeAttrMatch
}

export const Image = (props: Props) => {
    const {
        value: { named },
    } = props

    const src = replaceQuotes(named, 'src')
    const align = replaceQuotes(named, 'align') || ''
    const width = replaceQuotes(named, 'width') || ''
    const height = replaceQuotes(named, 'height') || ''
    const caption = replaceQuotes(named, 'caption') || ''

    let className = ''
    switch (align) {
        case 'center':
            className = 'w-fit mx-auto'
            break
        case 'right':
            className = 'w-fit ml-auto'
            break
    }

    return (
        <figure className={`mb-5 ${className}`}>
            <NextImage src={src} width={parseInt(width)} height={parseInt(height)} alt={caption} />
            {caption ? <figcaption className="mt-1 inline-block">{caption}</figcaption> : ''}
        </figure>
    )
}
