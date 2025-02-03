'use client'
import React, { useEffect, useState } from 'react'
/* Components */
import { Card } from '@common/components/containers/Card'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { Loading } from '@components/wordpress/archive/loading'
/* Helpers */
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import { flickrOpr, queryFlickr } from '@src/constants/graphql'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import type { FlickrImage } from '@src/types/flickr'
import type { Nullable } from '@common/types'
/* Assets */
import '@src/scss/flickr.scss'

const Flickr = () => {
    const flickr = useFlickr()

    if (!flickr) {
        return (
            <Loading
                className="flickr"
                counts={12}
                large={3}
                medium={4}
                small={3}
            />
        )
    }

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

const useFlickr = () => {
    const [flickr, setFlickr] = useState<Nullable<FlickrImage[]>>()
    useEffect(() => {
        fetchGQL(queryFlickr, flickrOpr, WEEK_IN_SECONDS)
            .then((result) => setFlickr(result))
            .catch(() => setFlickr([]))
    }, [])
    return flickr
}

export default Flickr
