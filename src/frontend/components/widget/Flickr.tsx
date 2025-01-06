import React from 'react'
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'
import { useFlickr } from 'src/frontend/hooks/useFlickr'

export function Flickr() {
    const { flickr } = useFlickr({ id: window.sujin.FLICKR_ID || '' })

    return (
        <section className="widget--flickr">
            <Row>
                {flickr.slice(0, 12).map((item) => (
                    <Column
                        className="widget--flickr__wrapper"
                        key={`flickr-${item.link}`}
                        large={3}
                        medium={4}
                        small={3}
                    >
                        <figure className="list-item__thumbnail">
                            <a
                                href={item.link}
                                rel="noopener noreferrer"
                                target="_blank"
                                title={item.title}
                            >
                                <div className="list-item__zoom" />

                                <div className="list-item__shadow" />

                                <img
                                    alt={item.title}
                                    className="list-item__image"
                                    src={item.media.replace('_m.jpg', '_s.jpg')}
                                />
                            </a>
                        </figure>
                    </Column>
                ))}
            </Row>
        </section>
    )
}
