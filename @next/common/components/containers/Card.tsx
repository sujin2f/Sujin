import React, { PropsWithChildren, useMemo } from 'react'
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
export const Card = ({ children, title, description, to, timestamp, image, className }: PropsWithChildren<Props>) => {
    const datetime = useMemo(() => timestamp && new Date(timestamp * DAY_IN_MS), [timestamp])

    return (
        <li className={className}>
            <figure className="overflow-hidden relative">
                <Link title={title || ''} href={to}>
                    <div className="absolute z-2 w-full h-full bg-primary opacity-0 hover:opacity-40"></div>
                    <div className="card__thumbnail__shadow"></div>
                    {datetime && !isNaN(datetime.getTime()) && (
                        <time className="card__time" dateTime={formatDate(datetime)}>
                            <span className="card__time__day">{datetime.getDate()}</span>
                            <span className="card__time__month">{ShortMonthNames[datetime.getMonth()]}</span>
                            <span className="card__time__year">{datetime.getFullYear()}</span>
                        </time>
                    )}
                    <picture className="card__image__container">
                        <img src={removeURLProtocol(image)} role="presentation" alt={title || ''} className="w-full" />
                    </picture>
                </Link>
            </figure>
            {title && (
                <div className="card__text">
                    <h2 className="card__title">
                        <Link title={title} href={to} className="card__link">
                            {title}
                        </Link>
                    </h2>
                    {description && <p className="card__description">{description}</p>}
                    {children && children}
                </div>
            )}
        </li>
    )
}

export default Card
