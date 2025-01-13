import React from 'react'
import { Card } from '@common/components/containers/Card'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { useFlickr } from '@src/hooks/useFlickr'

import '@src/scss/flickr.scss'

export function Flickr() {
    const { flickr } = useFlickr()

    return (
        <section className="widget--flickr">
            <Row fullWidth>
                {(flickr || []).slice(0, 12).map((item) => (
                    <Column
                        className="widget--flickr__column"
                        key={`flickr-${item.link}`}
                        large={3}
                        medium={4}
                        small={3}
                    >
                        <Card
                            to={item.link}
                            title={item.title}
                            image={item.media.replace('_m.jpg', '_s.jpg')}
                        />
                    </Column>
                ))}
            </Row>
        </section>
    )
}
