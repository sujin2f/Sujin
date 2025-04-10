'use client'
import React from 'react'
/* Components */
import { Card } from '@common/components/containers/Card'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { Loading } from '@app/_components/archive/loading'
/* CONSTANTS */
import GQL from '@app/api/graphql/constants'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
/* Utils */
import useIntersectionGQL from '@common/hooks/useIntersectionGQL'

const Flickr = () => {
    const [ref, flickr] = useIntersectionGQL(
        GQL.queryFlickr,
        'title link media',
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
