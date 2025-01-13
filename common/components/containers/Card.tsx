import React, { PropsWithChildren } from 'react'
import Link from 'next/link'

import { className } from '../../utils/string'
import { ShortMonthNames } from '../../constants/datetime'
import { removeURLProtocol } from '../../utils/string'

import '../../scss/card.scss'

type Props = {
    title?: string
    description?: string
    to: string
    time?: number
    image: string
    className?: string
}

export const Card = (props: PropsWithChildren<Props>) => {
    const time = props.time && new Date(props.time)
    return (
        <section className={className('card', props.className)}>
            <figure className="card__thumbnail">
                <Link title={props.title || ''} href={props.to}>
                    <div className="card__thumbnail__zoom"></div>
                    <div className="card__thumbnail__shadow"></div>
                    {time && (
                        <time
                            className="card__time"
                            dateTime={time.toISOString()}
                        >
                            <span className="card__time__day">
                                {time.getDate()}
                            </span>
                            <span className="card__time__month">
                                {ShortMonthNames[time.getMonth()]}
                            </span>
                            <span className="card__time__year">
                                {time.getFullYear()}
                            </span>
                        </time>
                    )}
                    <picture className="card__image__container">
                        <img
                            src={removeURLProtocol(props.image)}
                            role="presentation"
                            alt={props.title}
                            className="card__image"
                        />
                    </picture>
                </Link>
            </figure>
            {props.title && (
                <div className="card__text">
                    <h2 className="card__title">
                        <Link
                            title={props.title}
                            href={props.to}
                            className="card__link"
                        >
                            {props.title}
                        </Link>
                    </h2>
                    {props.description && (
                        <p className="card__description">{props.description}</p>
                    )}
                    {props.children && props.children}
                </div>
            )}
        </section>
    )
}
