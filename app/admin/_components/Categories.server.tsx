import sanitize from 'mongo-sanitize'
import { Suspense } from 'react'
/* Models */
import Cached from '@sujin/common/model/Cached'
import { LoadingTable } from '@app/_components/LoadingTable'
/* CONSTANTS */
import { COLLECTION, type T_Archive } from '@app/_lib/types'
import { ARCHIVE } from '@app/_lib/types'
/* Utils */
import { getCacheKey } from '@app/_lib/utils/cache'
import { auth } from '@app/api/auth/_lib/utils-mysql'
import { getCollection } from '@sujin/common/data/mongo/mongo'
import { getArchives } from '@app/admin/_lib/getArchives'
import { updateArchive } from '@app/admin/_lib/updateArchive'
/* Components */
import { CategoriesClient } from '@app/admin/_components/Categories.client'

type Props = {
    page: number
}

export async function CategoriesServer({ page }: Props) {
    const update = async (slug: string): Promise<string> => {
        'use server'
        if (!slug) return ''
        return await updateArchive(slug, ARCHIVE.CATEGORY)
            .then(() => `Category ${slug} Updated`)
            .catch((e) => e.message)
    }

    const remove = async (slug: string): Promise<string> => {
        'use server'
        if (!slug) return ''
        return await removeArchive(slug, ARCHIVE.CATEGORY)
            .then(() => `Category ${slug} Removed`)
            .catch((e) => e.message)
    }

    return (
        <Suspense fallback={<LoadingTable />}>
            <CategoriesClient
                update={update}
                remove={remove}
                categories={getArchives(ARCHIVE.CATEGORY, page)}
                page={page}
            />
        </Suspense>
    )
}

const removeArchive = async (_slug: string, _type: ARCHIVE) => {
    const slug = sanitize(_slug)
    const type = sanitize(_type)

    await auth()
    await Cached.getInstance().flush(
        getCacheKey(COLLECTION.ARCHIVE, type, slug),
    )
    const collection = await getCollection<T_Archive>(COLLECTION.ARCHIVE)
    return await collection.deleteOne({ slug, type })
}
