import Cached from '@common/model/Cached'
import { CacheClient } from './CacheClient'

export default async function Cache() {
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
