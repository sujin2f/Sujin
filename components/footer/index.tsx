'use client'

import { useEffect } from 'react'

import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { GoogleAdvert } from '@components/GoogleAdvert'
import { TagCloud } from '@components/footer/TagCloud'
import { Flickr } from '@components/footer/Flickr'
import { FooterBottom } from '@components/footer/FooterBottom'
import { WidgetTitle } from '@components/WidgetTitle'
import type { FlickrImage } from '@src/types/flickr'
import type { TagCloud as TagCloudType } from '@src/types/wordpress'
import { fetchGQL } from '@common/data/graphql/fetchGQL'
import {
    flickrOpr,
    queryFlickr,
    queryTagCloud,
    tagCloudOpr,
} from '@src/constants/graphql'
import { Loading } from '@components/(wordpress)/archive/loading'
import { WEEK_IN_SECONDS } from '@common/constants/datetime'
import { useGlobalState } from '@common/hooks/useGlobalState'

import '@src/scss/footer.scss'

export const Footer = () => {
    const [flickr, setFlickr] = useGlobalState<FlickrImage[] | null>(
        'flickr',
        [],
    )
    const [tagCloud, setTagCloud] = useGlobalState<TagCloudType[] | null>(
        'tag-cloud',
        [],
    )
    useEffect(() => {
        if (flickr && !flickr.length) {
            const fetchFlickr = async () => {
                const response = await fetchGQL(
                    queryFlickr,
                    flickrOpr,
                    WEEK_IN_SECONDS,
                ).catch(() => null)
                setFlickr(response)
            }
            fetchFlickr()
        }
    }, [flickr, setFlickr])
    useEffect(() => {
        if (tagCloud && !tagCloud.length) {
            const fetchTagCloud = async () => {
                const response = await fetchGQL(
                    queryTagCloud,
                    tagCloudOpr,
                    WEEK_IN_SECONDS,
                ).catch(() => null)
                setTagCloud(response)
            }
            fetchTagCloud()
        }
    }, [tagCloud, setTagCloud])

    return (
        <footer className="footer">
            <Row className="footer__top" dom="aside">
                <Column dom="section" medium={4} small={12}>
                    <GoogleAdvert />
                </Column>

                <Column dom="section" medium={4} small={12}>
                    <WidgetTitle>Photo Stream</WidgetTitle>
                    {flickr && flickr.length && <Flickr items={flickr} />}
                    {flickr && !flickr.length && (
                        <Loading
                            className="flickr"
                            counts={12}
                            large={3}
                            medium={4}
                            small={3}
                        />
                    )}
                </Column>

                <Column dom="section" medium={4} small={12}>
                    <WidgetTitle>Popular Tags</WidgetTitle>
                    {tagCloud && tagCloud.length && (
                        <TagCloud items={tagCloud} />
                    )}
                    {tagCloud && !tagCloud.length && (
                        <Loading
                            fullWidth
                            className="tag-cloud"
                            counts={1}
                            small={12}
                        />
                    )}
                </Column>
            </Row>
            <section className="footer__bottom">
                <FooterBottom />
            </section>
        </footer>
    )
}
