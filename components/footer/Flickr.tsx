import React, { use } from 'react'
import { Card } from '@common/components/containers/Card'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { FlickrImage } from '@src/types/flickr'

import '@src/scss/flickr.scss'

type Props = {
    readonly request: Promise<FlickrImage[]>
}

export const Flickr = ({ request }: Props) => {
    const flickr = use(request)

    return (
        <section className="widget--flickr">
            <Row fullWidth>
                {flickr.slice(0, 12).map((item) => (
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
