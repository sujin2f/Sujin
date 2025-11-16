'use client'
import { ApolloProvider } from '@apollo/client/react'
import { Provider as ReduxProvider } from 'react-redux'
/* Modules */
import { client } from '@lib/apollo/apollo-client-frontend'
import { store } from '@lib/store'
/* Components */
import Column from '@common/components/layout/Column'
import Row from '@common/components/layout/Row'
import { GoogleAdvert } from '@common/components/GoogleAdvert'
import TagCloud from '@lib/components/footer/TagCloud'
import Flickr from '@lib/components/footer/Flickr'
import { FooterBottom } from '@lib/components/footer/FooterBottom'
import { WidgetTitle } from '@lib/components/WidgetTitle'
/* Assets */
import './index.scss'

export const Footer = () => {
    return (
        <footer className="footer">
            <Row className="footer__top" dom="aside">
                <ReduxProvider store={store}>
                    <ApolloProvider client={client}>
                        {/* TODO use state */}
                        <Column dom="section" medium={4} small={12}>
                            <GoogleAdvert responsive place="footer" />
                        </Column>

                        <Column dom="section" medium={4} small={12}>
                            <WidgetTitle>Photo Stream</WidgetTitle>
                            <Flickr />
                        </Column>

                        <Column dom="section" medium={4} small={12}>
                            <WidgetTitle>Popular Tags</WidgetTitle>
                            <TagCloud />
                        </Column>
                    </ApolloProvider>
                </ReduxProvider>
            </Row>
            <section className="footer__bottom">
                <FooterBottom />
            </section>
        </footer>
    )
}
