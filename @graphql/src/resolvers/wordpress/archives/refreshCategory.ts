import sanitize from 'mongo-sanitize'
/* Models */
import { Archive } from '@src/schema/archive'
import Cached from '@sujin/node-cache'
/* Utils */
import { verifyAdmin } from '@src/utils/security'
import { getCacheKey } from '@sujin/lib/utils/cache'
import { getTermBySlug } from '@src/utils/mysql/term'
import { mysqlDisconnect } from '@src/utils/mysql'
import { convertWPImageURL } from '@src/utils/mongo/convertWPImageURL'
import { updateTotal } from '@src/utils/mongo/updateTotal'
/* CONSTANTS */
import { COLLECTION, ARCHIVE } from '@sujin/lib/constants'

export const refreshCategory = async (
    _slug: string,
    token: string,
): Promise<boolean[]> => {
    const slug = sanitize(_slug)

    verifyAdmin(
        token,
        'refreshCategory mutation has been called by non admin user',
    )

    const wp = await getTermBySlug(slug)
    await mysqlDisconnect()

    if (wp.image) {
        wp.image = convertWPImageURL(wp.image)
    }

    const archive = await Archive.findOneAndReplace({ slug }, { ...wp }).then(
        async (result) => {
            if (!result) {
                return await Archive.insertOne({
                    ...wp,
                    type: ARCHIVE.CATEGORY,
                })
            }
            return result
        },
    )

    await Cached.getInstance().flush(
        getCacheKey(COLLECTION.ARCHIVE, ARCHIVE.CATEGORY, slug),
    )
    await updateTotal([archive._id])
    return []
}
