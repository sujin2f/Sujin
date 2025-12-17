'use client'

import React, { MouseEvent, useState, useCallback, useMemo } from 'react'

/* Components */
import Button from '@common/components/forms/Button'
/* Helpers */
import { removeURLProtocol } from '@sujin/share/utils/string'
import { getPrev, getNext } from '@sujin/share/utils/array'
import type { T_ShortcodeAttrMatch } from '@sujin/lib/types'
/* Assets */
import Arrow from '@app/_lib/images/prev.svg'
import { getRatio } from '@sujin/share/utils/number'
import Image from 'next/image'

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
        <section className="relative bg-slate-300 flex flex-row-reverse transition-[height]" aria-label="Gallery">
            {/* Arrow Navigation */}
            <nav className="absolute w-full flex h-10 items-center justify-center" aria-label="Gallery Navigation">
                <Button
                    className="bg-primary w-10 h-10 cursor-pointer flex items-center justify-center"
                    onClick={prev}
                    aria-label="Show Prev Image"
                >
                    <Arrow className="w-7 h-7 fill-white" />
                </Button>
                <div className="bg-black text-white min-w-10 h-10 cursor-pointer flex items-center justify-center">
                    {index + 1}/{images.length}
                </div>
                <Button
                    className="bg-primary w-10 h-10 cursor-pointer flex items-center justify-center"
                    onClick={next}
                    aria-label="Show Next Image"
                >
                    <Arrow className="w-7 h-7 fill-white rotate-180" />
                </Button>
            </nav>

            <picture className="p-3">
                <Image
                    src={removeURLProtocol(images[index]).replace('//sujinc.com', '').replace('//cms.sujinc.com', '')}
                    alt={'Slide'}
                    role="presentation"
                    width={980}
                    height={980 * getRatio(widths[index], heights[index])}
                />
            </picture>

            <nav className="carousel__nav pt-3 pl-3 pb-3 flex-col gap-2 hidden sm:flex">
                {images.map((image, key) => (
                    <Image
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
