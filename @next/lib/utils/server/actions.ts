'server-only'
import { revalidateTag } from 'next/cache'
/* Models */
import Cached from '@sujin/share/model/Cache'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'

export const flushCache = async () => {
    await Cached.getInstance().flush()
    revalidateTag(COLLECTION.ARCHIVE)
    revalidateTag(COLLECTION.BACKGROUNDS)
    revalidateTag(COLLECTION.PAGE)
    revalidateTag(COLLECTION.POST)
    revalidateTag(COLLECTION.RECIPE)
    revalidateTag(COLLECTION.SPECTRA)
}
