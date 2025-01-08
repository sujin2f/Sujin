import React, { MouseEvent, useState, useCallback, useMemo } from 'react'

import { Button } from '@common/components/forms/Button'
import { getPrev, getNext } from '@common/utils/array'

import { AttrMatch } from '@project/types/wordpress'
import Arrow from '@frontend/images/prev.svg'

import 'src/frontend/scss/carousel.scss'

interface Props {
    value: AttrMatch
}

export const Carousel = (props: Props) => {
    const [index, setIndex] = useState(0)
    const {
        value: { named },
    } = props

    const images: string[] = useMemo(
        () =>
            Object.keys(named)
                .filter((key) => key.match(/sc[0-9]+/))
                .map((key) => named[key]),
        [named],
    )

    const prev = useCallback(() => {
        const [idx] = getPrev(images, index)
        setIndex(idx)
    }, [images, index])
    const next = useCallback(() => {
        const [idx] = getNext(images, index)
        setIndex(idx)
    }, [images, index])
    const onClick = useCallback((e: MouseEvent<HTMLImageElement>) => {
        const index = parseInt(
            e.currentTarget.getAttribute('data-index') || '0',
        )
        setIndex(index)
    }, [])

    return (
        <section className="carousel" aria-label="Gallery">
            <nav className="carousel__arrow__container">
                <Button
                    className="carousel__arrow carousel__arrow__prev"
                    onClick={prev}
                    aria-label="Show Prev Image"
                >
                    <Arrow />
                </Button>
                <div className="carousel__arrow__number">
                    {index + 1}/{images.length}
                </div>
                <Button
                    className="carousel__arrow carousel__arrow__next"
                    onClick={next}
                    aria-label="Show Next Image"
                >
                    <Arrow />
                </Button>
            </nav>

            <picture className="carousel__picture">
                <img
                    src={images[index]}
                    alt={images[index]}
                    role="presentation"
                />
            </picture>

            <nav className="carousel__nav">
                {images.map((image, key) => (
                    <img
                        src={image}
                        className={`${key === index && 'current'}`}
                        role="presentation"
                        key={`carousel-${image}-${key}`}
                        alt={image}
                        onClick={onClick}
                        data-index={key}
                    />
                ))}
            </nav>
        </section>
    )
}
