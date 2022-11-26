import React, { MouseEvent, useState } from 'react'

interface Props {
    images: string[]
}

export const Carousel = (props: Props): JSX.Element => {
    const [currentImageIndex, changeImageIndex] = useState(0)

    const prev = () => {
        const newIndex = currentImageIndex - 1
        if (newIndex < 0) {
            changeImageIndex(props.images.length - 1)
        }
        changeImageIndex(newIndex)
    }
    const next = () => {
        const newIndex = currentImageIndex + 1
        if (newIndex > props.images.length - 1) {
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
                    {currentImageIndex + 1}/{props.images.length}
                </div>
                <button className="next" type="button" onClick={next}>
                    <i></i>
                </button>
            </section>
            <section className="picture-frame">
                <img src={props.images[currentImageIndex]} alt="" />
            </section>

            <section className="nav">
                <nav>
                    {props.images.map((image, key) => (
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
