import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import { unstable_cache } from 'next/cache'
/* Components */
import Banner from '@components/header/Banner'
import { Archive as ArchiveComponent } from '@components/wordpress/archive/Archive'
import Header from '@components/header'
import Footer from '@components/footer'
/* Constants */
import { DAY_IN_SECONDS, HOUR_IN_SECONDS } from '@common/constants/datetime'
import { TermTypes } from '@src/constants/wordpress'
import { BASE_URL } from '@src/constants/system'
import { MenuNames } from '@src/constants/mysql-query'
import { VERSION } from '@common/constants/helper'
/* Utils */
import getArchive from '@src/db/mongo/wordpress/getArchive'
/* Types */
import type { ArchiveProp } from '@src/types/wordpress'

type Props = {
    params: Promise<ArchiveProp>
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
    const params = await props.params
    const { slug, page } = params
    const type = params.type === 'tag' ? TermTypes.post_tag : params.type
    const requestArchive = unstable_cache(
        async (params) => await getArchive(params),
        [type, slug, VERSION],
        {
            tags: ['wordpress', 'archive'],
            revalidate: DAY_IN_SECONDS,
        },
    )

    const archive = await requestArchive({ type, slug, page }).catch(() =>
        notFound(),
    )
    const url = `${BASE_URL}/archive/${type}/${slug}/page/${page}`

    return {
        title: `Sujin | ${archive.title}`,
        description: archive.excerpt,
        openGraph: {
            title: `Sujin | ${archive.title}`,
            url: url,
        },
        metadataBase: new URL(url),
    }
}

export default async function Archive(props: Props) {
    const params = await props.params
    const { slug, page } = params
    const type = params.type === 'tag' ? TermTypes.post_tag : params.type
    const requestArchive = unstable_cache(
        async (params) => await getArchive(params),
        [type, slug, VERSION],
        {
            tags: ['wordpress', 'archive'],
            revalidate: HOUR_IN_SECONDS,
        },
    )
    const archive = await requestArchive({ type, slug, page }).catch(() =>
        notFound(),
    )
    const { title, excerpt, image } = archive

    return (
        <>
            <Header />
            <main>
                <Banner
                    menu={MenuNames.MAIN}
                    banner={{
                        title: title,
                        excerpt: excerpt,
                        prefix: type,
                        background: image,
                    }}
                />

                <ArchiveComponent
                    type={type}
                    slug={slug}
                    page={page}
                    total={archive.total}
                />
            </main>
            <Footer />
        </>
    )
}
