import type { IndexDescriptionCompact } from 'mongodb'
/* Models */
import { UnauthorizedError } from '@common/model/Error'
/* CONSTANTS */
import { ERROR_MESSAGE } from '@app/_lib/constants-error'
/* Utils */
import { isAdmin } from '@app/_lib/data/mongo/user'
/* T_Types */
import { getCollection } from '@common/data/mongo/mongo'

export const getIndexes = async (...collections: string[]) => {
    if (!(await isAdmin()))
        throw new UnauthorizedError(ERROR_MESSAGE.UNAUTHORIZED, 'getIndexes()')
    const indexes: Record<string, IndexDescriptionCompact> = {}
    for (const name of collections) {
        const collection = await getCollection(name)
        const index = await collection
            .indexInformation()
            .catch((e) => console.log(name, e))
        if (index) {
            indexes[name] = index
        }
    }
    return indexes
}
