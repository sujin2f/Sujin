import { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'

import {
    getSingleMetadata,
    getPageParams,
    getSinglePageData,
} from '@app/(global-footer)/(wordpress)/util'
import { Banner } from '@components/header/Banner'
import { MenuNames } from '@src/constants/mysql-query'
import { redirect } from 'next/navigation'

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
    const slug = await getPageParams(props)
    return await getSingleMetadata(slug)
}

export default async function Layout(props: PropsWithChildren<PageProps>) {
    const slug = await getPageParams(props)
    const [post] = await getSinglePageData(slug)

    if (!post) {
        redirect('/404')
    }

    return (
        <>
            <Banner
                menu={MenuNames.MAIN}
                banner={{
                    title: post.title,
                    excerpt: post.excerpt,
                    icon: post.images.icon,
                    prefix: undefined,
                    background: post.images.background,
                    backgroundColor: post.meta.backgroundColor,
                }}
                className=""
            />

            {props.children}
        </>
    )
}
