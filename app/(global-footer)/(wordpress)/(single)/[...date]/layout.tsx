import { PropsWithChildren } from 'react'
import type { Metadata } from 'next/types'

import {
    getSingleMetadata,
    getPostParams,
    getSinglePageData,
} from '@app/(global-footer)/(wordpress)/util'
import { Banner } from '@components/header/Banner'
import { MenuNames } from '@src/constants/mysql-query'
import { redirect } from 'next/navigation'

export const generateMetadata = async (props: PostProps): Promise<Metadata> => {
    const params = await getPostParams(props.params)
    if (!params) {
        return {}
    }
    const [year, month, day, slug] = params
    return await getSingleMetadata(slug, year, month, day)
}

export default async function Layout(props: PropsWithChildren<PostProps>) {
    const params = await getPostParams(props.params)
    if (!params) {
        redirect('/404')
    }
    const [, , , slug] = params
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
