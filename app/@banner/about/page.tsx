'use server'
import { connection } from 'next/server'
/* Components */
import { Banner } from '@app/@banner/_components'
/* Utils */
import { getPage } from '@app/about/_lib/getPage'

export default async function AboutBanner() {
    await connection()
    const post = await getPage('about')
    if (!post) {
        return <></>
    }

    return (
        <Banner
            menu="primary"
            excerpt={post.excerpt}
            title={post.title}
            icon={post.images?.icon}
            background={post.images?.background}
        />
    )
}
