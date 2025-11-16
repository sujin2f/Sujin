'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { useDispatch, useSelector } from 'react-redux'
/* Components */
import { Card } from '@common/components/containers/Card'
import Column from '@common/components/layout/Column'
import Row from '@common/components/layout/Row'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* Utils */
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
/* Store */
import { setFlickr } from '@lib/store/slices/flickr'
import { RootState } from '@lib/store'
/* T_Type */
import type { T_FlickrImage } from '@sujin/lib/types'
/* CONSTANTS */
import FLICKR_QUERY from '@lib/constants/gql/flickr.graphql'

const Flickr = () => {
    // Redux store
    const flickr = useSelector((state: RootState) => state.flickr)
    const dispatch = useDispatch()
    const hasStore = useMemo(() => !!flickr.length, [flickr])

    // Read from GraphQL with Intersection Observer & update store
    const ref = useRef(null)
    const [skip, setSkip] = useState(true)
    const { loading, error, data } = useQuery<{ flickr: T_FlickrImage[] }>(
        FLICKR_QUERY,
        { skip: skip || hasStore },
    )
    useEffect(() => {
        if (!hasStore && data && data.flickr.length) {
            dispatch(setFlickr(data.flickr))
        }
    }, [data, hasStore, dispatch])
    useIntersectionObserver(ref, async () => {
        setSkip(false)
    })

    // Data is not yet ready
    if (!hasStore && (error || !data)) {
        return <div ref={ref} />
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
        </section>
    )
}
export default Flickr
