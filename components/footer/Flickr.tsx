'use client'
import React from 'react'
/* Components */
import { Card } from '@common/components/containers/Card'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { Loading } from '@components/wordpress/archive/loading'
/* Helpers */
import { flickrOpr, queryFlickr } from '@src/constants/graphql'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import useIntersectionGQL from '@common/hooks/useIntersectionGQL'
/* Assets */
import '@src/scss/flickr.scss'

const Flickr = () => {
    const [ref, flickr] = useIntersectionGQL(
        queryFlickr,
        flickrOpr,
        WEEK_IN_SECONDS,
    )

    return (
        <section className="widget--flickr" ref={ref}>
            {!flickr && (
                <Loading
                    className="flickr"
                    counts={12}
                    large={3}
                    medium={4}
                    small={3}
                    fullWidth
                />
            )}
            {flickr && (
                <Row fullWidth>
                    {flickr.slice(0, 12).map((item) => (
                        <Column
                            key={`flickr-${item.link}`}
                            className="widget--flickr__column"
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
            )}
        </section>
    )
}

export default Flickr
