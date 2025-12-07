import { type PropsWithChildren, useMemo, type ReactNode } from 'react'
import Link from 'next/link'

/* Utils */
import { formatDate } from '@sujin/share/utils/datetime'
import { removeURLProtocol } from '@sujin/share/utils/string'
import { DAY_IN_MS, ShortMonthNames } from '@sujin/share/constants/datetime'

type Props = {
    readonly to: string
    readonly title?: string
    readonly description?: string
    readonly timestamp?: number
    readonly image: string
    readonly className?: string
    readonly ratio?: string
    readonly picture?: ReactNode
}

/**
 * Card component that displays a card with an image, title, description, and optional time.
 *
 * @param {ReactNode} props.children - The content to display in the card.
 * @param {string} props.to - The URL to link to.
 * @param {string} [props.title] - The title of the card.
 * @param {string} [props.description] - The description of the card.
 * @param {Date} [props.time] - The timestamp to display on the card.
 * @param {string} props.image - The URL of the image to display on the card.
 * @param {string} [props.className] - Additional class names for the card.
 */
export const Card = ({
    children,
    title,
    description,
    to,
    timestamp,
    image,
    picture,
    className,
    ratio,
}: PropsWithChildren<Props>) => {
    const datetime = useMemo(() => timestamp && new Date(timestamp * DAY_IN_MS), [timestamp])

    return (
        <li className={`${className}`}>
            <figure className={`card__figure overflow-hidden relative shadow ${ratio}`}>
                <Link title={title || ''} href={to}>
                    <div className="card__zoom absolute z-2 w-full h-full"></div>
                    {/* <div className="card__shadow absolute z-3 w-full h-full shadow shadow-inner shadow-lg"></div> */}
                    {datetime && !isNaN(datetime.getTime()) && (
                        <time
                            className="absolute z-3 right-0 w-fit aspect-square bg-primary text-white p-3"
                            dateTime={formatDate(datetime)}
                        >
                            <span className="block font-bold text-5xl text-center">{datetime.getDate()}</span>
                            <div className="text-center leading-5">
                                <span className="mr-1">{ShortMonthNames[datetime.getMonth()]}</span>
                                <span>{datetime.getFullYear()}</span>
                            </div>
                        </time>
                    )}
                    {picture || (
                        <picture>
                            <img
                                src={removeURLProtocol(image)}
                                role="presentation"
                                alt={title || ''}
                                className="w-full h-full object-cover object-center"
                            />
                        </picture>
                    )}
                </Link>
            </figure>
            {title && (
                <>
                    <h3 className="mt-2">
                        <Link title={title} href={to} className="text-primary font-bold text-2xl">
                            {title}
                        </Link>
                    </h3>
                    {description && <p>{description}</p>}
                    {children && children}
                </>
            )}
        </li>
    )
}

export default Card
