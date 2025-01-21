'use client'

import React, { MouseEvent, useState, useCallback, useMemo } from 'react'

/* Components */
import { Button } from '@common/components/forms/Button'
/* Helpers */
import { removeURLProtocol } from '@common/utils/string'
import type { AttrMatch } from '@src/types/wordpress'
import { Arr } from '@common/model/Array'
/* Assets */
import Arrow from '@src/images/prev.svg'
import '@src/scss/carousel.scss'

interface Props {
    value: AttrMatch
}

/**
 * Carousel component that renders a carousel of images with navigation buttons.
 *
 * @param {AttrMatch} props.value - The value containing the attributes for the carousel.
 */
export const Carousel = ({ value: { named } }: Props) => {
    const [index, setIndex] = useState(0)

    const images = useMemo(
        () =>
            new Arr(Object.keys(named))
                .filter((key) => key.match(/sc[0-9]+/))
                .map((key) => named[key]),
        [named],
    )

    const prev = useCallback(() => {
        const [idx] = images.getPrev(index)
        setIndex(idx)
    }, [images, index])
    const next = useCallback(() => {
        const [idx] = images.getNext(index)
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
            {/* Arrow Navigation */}
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
                    src={removeURLProtocol(images[index])}
                    alt={removeURLProtocol(images[index])}
                    role="presentation"
                />
            </picture>

            <nav className="carousel__nav">
                {images.map((image, key) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={removeURLProtocol(image)}
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
