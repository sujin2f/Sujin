import Cached from '@sujin/common/model/Cached'
import { CacheClient } from '@app/admin/_components/Cache.client'

export async function CacheServer() {
    const caches = await Cached.getInstance().list()
    const removeCache = async (key?: string) => {
        'use server'
        if (key) {
            await Cached.getInstance().flush(key)
        } else {
            await Cached.getInstance().flush()
        }
    }

    return <CacheClient caches={caches} removeCache={removeCache} />
}
