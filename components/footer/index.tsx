'use client'

import { Suspense, useEffect, useState } from 'react'

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
    const [requestFlickr, setRequestFlickr] = useState<Promise<FlickrImage[]>>()
    const [requestTagCloud, setRequestTagCloud] =
        useState<Promise<TagCloudType[]>>()

    useEffect(
        () =>
            setRequestFlickr(fetchGQL(queryFlickr, flickrOpr, WEEK_IN_SECONDS)),
        [],
    )
    useEffect(
        () =>
            setRequestTagCloud(
                fetchGQL(queryTagCloud, tagCloudOpr, WEEK_IN_SECONDS),
            ),
        [],
    )

    return (
        <footer className="footer">
            <Row className="footer__top" dom="aside">
                <Column dom="section" medium={4} small={12}>
                    <GoogleAdvert />
                </Column>

                <Column dom="section" medium={4} small={12}>
                    <WidgetTitle>Photo Stream</WidgetTitle>
                    <Suspense
                        fallback={
                            <Loading
                                className="flickr"
                                counts={12}
                                large={3}
                                medium={4}
                                small={3}
                            />
                        }
                    >
                        {requestFlickr && <Flickr request={requestFlickr} />}
                    </Suspense>
                </Column>

                <Column dom="section" medium={4} small={12}>
                    <WidgetTitle>Popular Tags</WidgetTitle>
                    <Suspense
                        fallback={
                            <Loading
                                fullWidth
                                className="tag-cloud"
                                counts={1}
                                small={12}
                            />
                        }
                    >
                        {requestTagCloud && (
                            <TagCloud request={requestTagCloud} />
                        )}
                    </Suspense>
                </Column>
            </Row>
            <section className="footer__bottom">
                <FooterBottom />
            </section>
        </footer>
    )
}
