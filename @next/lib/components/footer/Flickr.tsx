'use client'
import React, { useRef, useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
/* Components */
import { Card } from '@common/components/containers/Card'
import Column from '@common/components/layout/Column'
import Row from '@common/components/layout/Row'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* Utils */
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
/* T_Type */
import type { T_FlickrImage } from '@sujin/lib/types'

const Flickr = () => {
    const ref = useRef(null)
    const [skip, setSkip] = useState(true)
    const { loading, error, data } = useQuery<{ flickr: T_FlickrImage[] }>(
        gql`
            query Flickr {
                flickr {
                    link
                    media
                    title
                }
            }
        `,
        { skip },
    )

    useIntersectionObserver(ref, async () => {
        setSkip(false)
    })

    if (error) {
        return <></>
    }

    return (
        <section className="widget--flickr" ref={ref}>
            {loading && (
                <LoadingArchive
                    className="flickr"
                    counts={12}
                    large={3}
                    medium={4}
                    small={3}
                    fullWidth
                />
            )}
            {data && data.flickr.length && (
                <Row fullWidth>
                    {data.flickr.slice(0, 12).map((item) => (
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
