import React, { MouseEvent, useState, useCallback } from 'react'

import { AttrMatch } from 'src/types/wordpress'
import { replaceQuotes } from 'src/frontend/utils/single'

require('src/frontend/scss/carousel.scss')

interface Props {
    value: AttrMatch
}

export const Carousel = (props: Props): JSX.Element => {
    const [currentImageIndex, changeImageIndex] = useState(0)
    const {
        value: { named },
    } = props
    const images: string[] = Object.keys(named)
        .filter((key) => key.match(/sc[0-9]+/))
        .map((key) => named[key])

    const prev = () => {
        const newIndex = currentImageIndex - 1
        if (newIndex < 0) {
            changeImageIndex(images.length - 1)
        }
        changeImageIndex(newIndex)
    }
    const next = () => {
        const newIndex = currentImageIndex + 1
        if (newIndex > images.length - 1) {
            changeImageIndex(0)
        }
        changeImageIndex(newIndex)
    }
    const navItemClick = (e: MouseEvent<HTMLImageElement>) => {
        const index = parseInt(
            e.currentTarget.getAttribute('data-image-index') || '0',
        )
        changeImageIndex(index)
    }
    return (
        <section className="carousel">
            <section className="arrow-nav">
                <button className="prev" type="button" onClick={prev}>
                    <i></i>
                </button>
                <div className="indicator">
                    {currentImageIndex + 1}/{images.length}
                </div>
                <button className="next" type="button" onClick={next}>
                    <i></i>
                </button>
            </section>
            <section className="picture-frame">
                <img src={images[currentImageIndex]} alt="" />
            </section>

            <section className="nav">
                <nav>
                    {images.map((image, key) => (
                        <img
                            src={image}
                            className={`${
                                key === currentImageIndex ? 'current' : ''
                            }`}
                            role="presentation"
                            key={`carousel-${image}=${key}`}
                            alt={image}
                            onClick={navItemClick}
                            data-image-index={key}
                        />
                    ))}
                </nav>
            </section>
        </section>
    )
}
