/* Components */
import { PrevNext } from '@app/components/single/PrevNext'
import TagsTable from '@app/admin/tags/[page]/TagsTable'
/* Constants */
import { PER_PAGE } from '@src/constants/mysql-query'
/* Utils */
import { getTags, updateTag } from '@src/db/mongo/wordpress/tag'
/* Types */
import type { PostType } from '@src/types/wordpress'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Tags(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    const terms = await getTags(page)

    const update = async (slug: string) => {
        'use server'
        if (!slug) return
        await updateTag(slug)
    }

    const getPosts = async (slug: string) => {
        'use server'
        if (!slug) return
        // @todo
        // await getPosts(slug)
    }

    const prev =
        page !== 1
            ? ({
                  title: 'Prev',
                  link: `/admin/tags/${page - 1}`,
              } as PostType)
            : undefined
    const next =
        terms.length === PER_PAGE
            ? ({
                  title: 'Next',
                  link: `/admin/tags/${page + 1}`,
              } as PostType)
            : undefined

    return (
        <>
            <h2>Tags</h2>
            <TagsTable terms={terms} update={update} getPosts={getPosts} />
            <PrevNext posts={[prev, next]} />
        </>
    )
}
