// import { ArchiveVariables } from 'src/constants/graphql'
import { Term, TermTypes } from 'src/types/wordpress'
import { getTermBy } from 'src/utils/mysql/term'
import { updateHit } from 'src/utils/mysql/tag-cloud'
import { Cached } from 'src/utils/cached'
import { GetOperationArgsType } from 'src/common/graphql'
import { operationArchive } from 'src/constants/graphql'

export type ArchiveVariables = {
    type: TermTypes
    slug: string
    page: number
}

export const archive = async ({
    type,
    slug,
    page,
}: GetOperationArgsType<typeof operationArchive>): Promise<Term> => {
    const cacheKey = `archive ${type} ${slug} ${page}`
    const cache = Cached.getInstance()
    const term = await cache.getOrExecute<Term>(cacheKey, async () => {
        return await getTermBy(type, slug, page)
    })

    if (cache.isFailed(term)) {
        console.error(`🤬 Cannot find the term: ${type}, ${slug}, ${page}`)
        throw new Error(`🤬 Cannot find the term: ${type}, ${slug}, ${page}`)
    }

    if (type === TermTypes.tag) {
        void updateHit(term.id)
    }

    return term
}
