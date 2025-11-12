import sanitize from 'mongo-sanitize'
/* CONSTANTS */
import { ARCHIVE } from '@sujin/lib/types'
import { Archive } from '@src/schema/archive'

type Param = {
    slug: string
}

export const updateHits = async (_: unknown, { slug: _slug }: Param) => {
    const slug = sanitize(_slug)
    await Archive.updateOne({ slug, type: ARCHIVE.TAG }, { $inc: { hits: 1 } })
    return {
        result: true,
    }
}
