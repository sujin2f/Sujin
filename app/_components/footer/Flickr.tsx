'use client'
import React from 'react'
/* Components */
import { Card } from '@common/components/containers/Card'
import Column from '@common/components/layout/Column'
import Row from '@common/components/layout/Row'
import { Loading } from '@app/archive/_components/Loading'
/* CONSTANTS */
import GQL from '@app/api/graphql/_lib/constants'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { Context } from '@app/_lib/constants.store'
/* Utils */
import useIntersectionGQLStore from '@common/hooks/useIntersectionGQLStore'

const Flickr = () => {
    const { items, pending, error, ref } = useIntersectionGQLStore(
        'flickr',
        Context,
        GQL.queryFlickr,
        'title link media',
        WEEK_IN_SECONDS,
    )

    if (error) {
        return
    }

    return (
        <section className="widget--flickr" ref={ref}>
            {pending && (
                <Loading
                    className="flickr"
                    counts={12}
                    large={3}
                    medium={4}
                    small={3}
                    fullWidth
                />
            )}
            {items.length && (
                <Row fullWidth>
                    {items.slice(0, 12).map((item) => (
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
