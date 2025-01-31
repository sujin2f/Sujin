'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

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

import '@src/scss/footer.scss'

export const Footer = () => {
    const isFrontPage = usePathname() === '/'
    return !isFrontPage ? <CommonFooter /> : <></>
}

export const CommonFooter = () => {
    const [flickr, setFlickr] = useState<FlickrImage[] | boolean>(false)
    const [tagCloud, setTagCloud] = useState<TagCloudType[] | boolean>(false)
    useEffect(() => {
        fetchGQL(queryFlickr, flickrOpr, WEEK_IN_SECONDS)
            .then((result) => setFlickr(result))
            .catch(() => setFlickr([]))
    }, [])
    useEffect(() => {
        fetchGQL(queryTagCloud, tagCloudOpr, WEEK_IN_SECONDS)
            .then((result) => setTagCloud(result))
            .catch(() => setTagCloud([]))
    }, [])

    return (
        <footer className="footer">
            <Row className="footer__top" dom="aside">
                <Column dom="section" medium={4} small={12}>
                    <GoogleAdvert responsive place="footer" />
                </Column>

                <Column dom="section" medium={4} small={12}>
                    <WidgetTitle>Photo Stream</WidgetTitle>
                    {Array.isArray(flickr) && <Flickr items={flickr} />}
                    {!Array.isArray(flickr) && (
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
                    {Array.isArray(tagCloud) && <TagCloud items={tagCloud} />}
                    {!Array.isArray(tagCloud) && (
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
