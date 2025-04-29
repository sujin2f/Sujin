import type { Document } from 'mongodb'
/* Models */
import { UnauthorizedError } from '@common/model/Error'
/* CONSTANTS */
import { ERROR_MESSAGE } from '@app/_lib/constants-error'
/* Utils */
import { isAdmin } from '@app/_lib/data/mongo/user'
/* T_Types */
import { getCollection } from '@common/data/mongo/mongo'

export const getSchema = async (...collections: string[]) => {
    if (!(await isAdmin()))
        throw new UnauthorizedError(ERROR_MESSAGE.UNAUTHORIZED, 'getSchema()')
    const schema: Record<string, Document> = {}

    for (const name of collections) {
        const collection = await getCollection(name)
        const info = await collection
            .options()
            .then((schema) => {
                const { validator } = schema
                if (validator) {
                    return validator.$jsonSchema
                }
                return {}
            })
            .catch((e) => console.log(collection, e))

        if (info) {
            schema[name] = info
        }
    }

    return schema
}
