'use server'
import Link from 'next/link'
/* Components */
import { GoogleAdvert } from '@common/components/GoogleAdvert'
import TagCloud from '@app/@footer/_components/TagCloud'
import Flickr from '@app/@footer/_components/Flickr'
import { WidgetTitle } from '@app/_components/WidgetTitle'
/* Assets */
import Logo from '@app/_lib/images/logo.svg'
import '@app/_lib/scss/recent-posts.scss'

export const Footer = async () => {
    return (
        <footer className="bg-slate-900">
            <aside className="container mx-auto px-3 grid grid-cols-1 pt-10 pb-3 gap-15 max-w-6xl md:grid-cols-3">
                <section>
                    <GoogleAdvert
                        responsive
                        place="footer"
                        clientId={`${process.env.GOOGLE_AD_CLIENT}`}
                        slot={`${process.env.GOOGLE_AD_SLOT_FOOTER}`}
                    />
                </section>

                <section>
                    <WidgetTitle invert>Photo Stream</WidgetTitle>
                    <Flickr />
                </section>

                <section>
                    <WidgetTitle invert>Popular Tags</WidgetTitle>
                    <TagCloud />
                </section>
            </aside>
            <section className="bg-gray-950">
                <div className="container mx-auto px-3 py-3 flex align-center">
                    <Link className="" href="/">
                        <Logo aria-label="Sujin" className="w-17 mr-4 mb-1" />
                    </Link>

                    <p className="text-white font-thin text-sm mt-2">Copyright &copy; 2017 sujinc.com</p>
                </div>
            </section>
        </footer>
    )
}
