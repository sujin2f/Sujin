'use client'

import React, { MouseEvent, useState, useCallback, useMemo } from 'react'

/* Components */
import Button from '@common/components/forms/Button'
/* Helpers */
import { removeURLProtocol } from '@sujin/share/utils/string'
import { getPrev, getNext } from '@sujin/share/utils/array'
import type { T_ShortcodeAttrMatch } from '@sujin/lib/types'
/* Assets */
import Arrow from '@common/images/prev.svg'
import NextImage from '@common/components/containers/NextImage'
import { getRatio } from '@sujin/share/utils/number'

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
                .map((key) => named[key].replaceAll(/&#8221;|&#8243;/g, '')),
        [named],
    )
    const widths = useMemo(
        () =>
            Object.keys(named)
                .filter((key) => key.match(/width[0-9]+/))
                .map((key) => parseInt(named[key].replaceAll(/&#8221;|&#8243;/g, ''))),
        [named],
    )
    const heights = useMemo(
        () =>
            Object.keys(named)
                .filter((key) => key.match(/height[0-9]+/))
                .map((key) => parseInt(named[key].replaceAll(/&#8221;|&#8243;/g, ''))),
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
        const index = parseInt(e.currentTarget.getAttribute('data-index') || '0')
        setIndex(index)
    }, [])

    return (
        <section className="carousel" aria-label="Gallery">
            {/* Arrow Navigation */}
            <nav className="carousel__arrow__container">
                <Button className="carousel__arrow carousel__arrow__prev" onClick={prev} aria-label="Show Prev Image">
                    <Arrow />
                </Button>
                <div className="carousel__arrow__number">
                    {index + 1}/{images.length}
                </div>
                <Button className="carousel__arrow carousel__arrow__next" onClick={next} aria-label="Show Next Image">
                    <Arrow />
                </Button>
            </nav>

            <picture className="carousel__picture">
                <NextImage
                    src={removeURLProtocol(images[index])}
                    alt={removeURLProtocol(images[index])}
                    role="presentation"
                    width={980}
                    height={980 * getRatio(widths[index], heights[index])}
                />
            </picture>

            <nav className="carousel__nav">
                {images.map((image, key) => (
                    <NextImage
                        src={removeURLProtocol(image)}
                        className={`${key === index && 'current'}`}
                        role="presentation"
                        key={`carousel-${image}-${key}`}
                        alt={image}
                        onClick={onClick}
                        data-index={key}
                        width={105}
                        height={105 * getRatio(widths[index], heights[index])}
                    />
                ))}
            </nav>
        </section>
    )
}
