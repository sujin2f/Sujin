'use client'
/* Components */
import { Card } from '@app/archive/_components/Card'
/* Utils */
import { getFlickr } from '@app/@footer/_lib/getFlickr'
import { useStoreOrAction } from '@app/_lib/hooks/useStoreOrAction'
import { map } from '@common/utils/array'
import { setFlickr } from '@app/_store/slices/flickr'

const Flickr = () => {
    const { ref, loading, error, data: flickr } = useStoreOrAction('flickr', getFlickr, setFlickr)

    if (error) {
        return
    }

    // Data is not yet ready
    if (!flickr || !flickr.length) {
        return (
            <ul className="columns-4" ref={ref}>
                {map(12, (_, index) => (
                    <li key={`flickr-loading-${index}`} className="bg-slate-500 aspect-square mb-4 animate-pulse"></li>
                ))}
            </ul>
        )
    }

    return (
        <ul className="columns-4" ref={ref}>
            {loading &&
                map(12, (_, index) => (
                    <li key={`flickr-loading-${index}`} className="bg-slate-500 aspect-square mb-4 animate-pulse"></li>
                ))}
            {flickr.slice(0, 12).map((item) => (
                <Card
                    to={item.link}
                    image={item.media.replace('_m.jpg', '_s.jpg')}
                    key={`flickr-${item.link}`}
                    className="aspect-square mb-4"
                    ratio="aspect-square"
                />
            ))}
        </ul>
    )
}
export default Flickr
