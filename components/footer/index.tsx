/* Components */
import { Column } from '@common/components/layout/Column'
import { Row } from '@common/components/layout/Row'
import GoogleAdvert from '@components/GoogleAdvert'
import TagCloud from '@components/footer/TagCloud'
import Flickr from '@components/footer/Flickr'
import { FooterBottom } from '@components/footer/FooterBottom'
import Title from '@components/WidgetTitle'
/* Helpers */
import { getPathName } from '@src/utils/server'
/* Assets */
import '@src/scss/footer.scss'

const Footer = async () => {
    // Front Page
    const path = await getPathName()
    if (path === '/') {
        return <></>
    }

    return (
        <footer className="footer">
            <Row className="footer__top" dom="aside">
                <Column dom="section" medium={4} small={12}>
                    <GoogleAdvert responsive place="footer" />
                </Column>

                <Column dom="section" medium={4} small={12}>
                    <Title>Photo Stream</Title>
                    <Flickr />
                </Column>

                <Column dom="section" medium={4} small={12}>
                    <Title>Popular Tags</Title>
                    <TagCloud />
                </Column>
            </Row>
            <section className="footer__bottom">
                <FooterBottom />
            </section>
        </footer>
    )
}

export default Footer
