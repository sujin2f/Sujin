'use server'
import { Logger } from '@common/model/Logger'
import type { ArchiveProp, Term } from '@src/types/wordpress'
// Models
import { Cached } from '@common/model/Cached'
import Mongo from '@common/data/mongo/mongo'
import { getTermBySlug } from '@src/db/mysql/getTermBy'

export const request = async (props: ArchiveProp): Promise<Term> => {
    const { slug, type } = props
    const term = await Mongo.findOne<Term>('term', { slug, type }).catch(
        async () => {
            Logger.server(
                `Access MySQL for getting archive type: ${type} and slug: ${slug}.`,
            )

            const term = await getTermBySlug(props)
            await Mongo.insertOne('term', term)
            return term
        },
    )
    const total = await Mongo.count('post', {
        'categories.slug': slug,
        status: 'publish',
        type: 'post',
    })

    return {
        ...term,
        total,
    }
}

export const getArchive = async (props: ArchiveProp) => {
    const slug = props.slug.toLowerCase()
    const key = `archive-${props.type}-${slug}`
    return await Cached.getInstance().getOrExecute(
        key,
        async () =>
            await request({
                ...props,
                slug,
            }),
        0,
        true,
    )
}
