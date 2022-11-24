import { ArchiveVariables } from 'src/constants/graphql'
import { Term } from 'src/types/wordpress'
import { getTermBy } from 'src/utils/mysql/term'

export const archive = async ({
    type,
    slug,
    page,
}: ArchiveVariables): Promise<Term> => {
    const term = await getTermBy(type, slug, page)
    if (!term) {
        console.error(`🤬 Cannot find the term: ${type}, ${slug}, ${page}`)
        throw new Error(`🤬 Cannot find the term: ${type}, ${slug}, ${page}`)
    }
    return term
}
