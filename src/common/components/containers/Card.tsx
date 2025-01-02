import React, { PropsWithChildren } from 'react'

import { className } from 'src/common/utils/string'
import { Link } from 'react-router-dom'
import { ShortMonthNames } from 'src/common/constants/datetime'

require('src/common/scss/card.scss')

type Props = {
    title: string
    description?: string
    to: string
    time: number
    image: string
    className?: string
}

export const Card = (props: PropsWithChildren<Props>): JSX.Element => {
    const time = new Date(props.time)
    return (
        <section className={className('card', props.className)}>
            <figure className="card__thumbnail">
                <Link title={props.title} to={props.to}>
                    <div className="card__thumbnail__zoom"></div>
                    <div className="card__thumbnail__shadow"></div>
                    <time className="card__time" dateTime={time.toISOString()}>
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
                    <picture className="card__image__container">
                        <img
                            src={props.image}
                            role="presentation"
                            alt={props.title}
                            className="card__image"
                        />
                    </picture>
                </Link>
            </figure>
            <div>
                <h2 className="card__title">
                    <Link title={props.title} to={props.to}>
                        {props.title}
                    </Link>
                </h2>
                {props.description && (
                    <p className="card__description">{props.description}</p>
                )}
                {props.children && props.children}
            </div>
        </section>
    )
}
