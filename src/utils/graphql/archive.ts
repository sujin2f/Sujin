import { ArchiveVariables } from 'src/constants/graphql'
import { Term } from 'src/types'
import { getTermBy } from 'src/utils/mysql/get-term-by'

export const archive = async ({
    type,
    slug,
    page,
}: ArchiveVariables): Promise<Term> => {
    return await getTermBy(type, slug, page)
}
