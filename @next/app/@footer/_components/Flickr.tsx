'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
/* Components */
import { Card } from '@common/components/containers/Card'
import { LoadingArchive } from '@lib/components/archive/LoadingArchive'
/* Utils */
import useIntersectionObserver from '@common/hooks/useIntersectionObserver'
import { useServerAction } from '@app/_hooks/useServerAction'
/* Store */
import { setFlickr } from '@app/_store/slices/flickr'
import { RootState } from '@app/_store'
/* T_Type */
import type { T_FlickrImage } from '@sujin/lib/types'

type Props = {
    readonly action: () => Promise<T_FlickrImage[]>
}

const Flickr = ({ action }: Props) => {
    // Redux store
    const flickr = useSelector((state: RootState) => state.flickr)
    const dispatch = useDispatch()
    const hasStore = useMemo(() => !!flickr.length, [flickr])

    // Read from GraphQL with Intersection Observer & update store
    const ref = useRef(null)
    const [skip, setSkip] = useState(true)
    // Read from GraphQL
    const { loading, error, data } = useServerAction(action, skip || hasStore)

    useEffect(() => {
        if (!hasStore && data && data.length) {
            dispatch(setFlickr(data))
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
        <ul className="columns-4" ref={ref}>
            {loading && <LoadingArchive className="flickr" counts={12} large={3} medium={4} small={3} fullWidth />}
            {flickr.slice(0, 12).map((item) => (
                <Card
                    to={item.link}
                    image={item.media.replace('_m.jpg', '_s.jpg')}
                    key={`flickr-${item.link}`}
                    className="aspect-square mb-4"
                />
            ))}
        </ul>
    )
}
export default Flickr
