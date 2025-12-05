'use server'
import Link from 'next/link'
/* Components */
import { GoogleAdvert } from '@common/components/GoogleAdvert'
import TagCloud from '@lib/components/footer/TagCloud'
import Flickr from '@lib/components/footer/Flickr'
import { WidgetTitle } from '@lib/components/WidgetTitle'
/* Utils */
import { flickr as getFlickr } from '@lib/apollo/queries/misc/flickr'
import { tagCloud as getTagCloud } from '@lib/apollo/queries/wordpress/archives/tagCloud'
import { gqlRequest } from '@lib/redis/client'
import { COLLECTION } from '@sujin/lib/constants'
/* Assets */
import Logo from '@common/images/logo.svg'

export const Footer = async () => {
    async function requestFlickr() {
        'use server'
        return await gqlRequest(async () => await getFlickr(), `flickr`)
    }
    async function requestTagCloud() {
        'use server'
        return await gqlRequest(async () => await getTagCloud(), `${COLLECTION.ARCHIVE}-tagCloud`)
    }

    return (
        <footer className="bg-slate-900">
            <aside className="container mx-auto grid grid-cols-3 pt-10 pb-3 gap-15">
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
                    <Flickr action={requestFlickr} />
                </section>

                <section>
                    <WidgetTitle invert>Popular Tags</WidgetTitle>
                    <TagCloud action={requestTagCloud} />
                </section>
            </aside>
            <section className="bg-gray-950">
                <div className="container mx-auto pt-3 pb-3 flex align-center">
                    <Link className="" href="/">
                        <Logo aria-label="Sujin" className="w-17 mr-4 mb-1" />
                    </Link>

                    <p className="text-white font-thin text-sm mt-2">Copyright &copy; 2017 sujinc.com</p>
                </div>
            </section>
        </footer>
    )
}
