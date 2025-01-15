'use client'

import { PropsWithChildren, Suspense, useEffect, useState } from 'react'

import { Banner } from '@app/components/header/Banner'
import { FixedHeader } from '@app/components/header/FixedHeader'
import { useContext } from '@src/store'
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import { GoogleAdvert } from '@app/components/GoogleAdvert'
import { TagCloud } from '@app/components/footer/TagCloud'
import { Flickr } from '@app/components/footer/Flickr'
import { FooterBottom } from '@app/components/footer/FooterBottom'
import { WidgetTitle } from '@app/components/WidgetTitle'
import type { FlickrImage } from '@src/types/flickr'
import type { TagCloud as TagCloudType } from '@src/types/wordpress'
import { fetchGQL } from '@common/graphql/fetchGQL'
import {
    flickrOpr,
    queryFlickr,
    queryTagCloud,
    tagCloudOpr,
} from '@src/constants/graphql'
import { Loading } from '@app/components/archive/loading'

import '@src/scss/footer.scss'

export const WrapperClient = ({ children }: PropsWithChildren) => {
    const [{ wrapperClass }] = useContext()
    const [requestFlickr, setRequestFlickr] = useState<Promise<FlickrImage[]>>()
    const [requestTagCloud, setRequestTagCloud] =
        useState<Promise<TagCloudType[]>>()

    useEffect(() => setRequestFlickr(fetchGQL(queryFlickr, flickrOpr)), [])
    useEffect(
        () => setRequestTagCloud(fetchGQL(queryTagCloud, tagCloudOpr)),
        [],
    )

    return (
        <>
            <div className={`wrapper ${wrapperClass}`}>
                <FixedHeader />
                <main>
                    <Banner />
                    {children}
                </main>
            </div>
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
                            {requestFlickr && (
                                <Flickr request={requestFlickr} />
                            )}
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
        </>
    )
}
