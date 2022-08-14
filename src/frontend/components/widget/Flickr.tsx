import React from 'react'
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'
import { useFlickr } from 'src/frontend/hooks/useFlickr'

export const Flickr = (): JSX.Element => {
    const { flickr } = useFlickr()

    return (
        <section className="widget--flickr">
            <Row>
                {flickr.slice(0, 12).map((item) => (
                    <Column
                        large={3}
                        medium={4}
                        small={3}
                        className="widget--flickr__wrapper"
                        key={`flickr-${item.link}`}
                    >
                        <figure className="list-item__thumbnail">
                            <a
                                href={item.link}
                                title={item.title}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <div className="list-item__zoom" />
                                <div className="list-item__shadow" />

                                <img
                                    src={item.media.replace('_m.jpg', '_s.jpg')}
                                    alt={item.title}
                                    className="list-item__image"
                                />
                            </a>
                        </figure>
                    </Column>
                ))}
            </Row>
        </section>
    )
}
