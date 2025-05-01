'use client'

import React, { MouseEvent, useState, useCallback, useMemo } from 'react'

/* Components */
import Button from '@common/components/forms/Button'
/* Helpers */
import { removeURLProtocol } from '@common/utils/string'
import { getPrev, getNext } from '@common/utils/array'
import type { T_ShortcodeAttrMatch } from '@app/_lib/types'
/* Assets */
import Arrow from '@app/_lib/images/prev.svg'
import '@app/(single)/_components/carousel.scss'

interface Props {
    value: T_ShortcodeAttrMatch
}

/**
 * Carousel component that renders a carousel of images with navigation buttons.
 *
 * @param {T_ShortcodeAttrMatch} props.value - The value containing the attributes for the carousel.
 */
export const Carousel = ({ value: { named } }: Props) => {
    const [index, setIndex] = useState(0)

    const images = useMemo(
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
