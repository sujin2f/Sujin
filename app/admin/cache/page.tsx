import Cached from '@common/model/Cached'
import CacheTable from '@components/admin/CacheTable'

export default async function Cache() {
    const caches = await Cached.getInstance().list()
    const removeCache = async (key: string) => {
        'use server'
        Cached.getInstance().flush(key)
    }

    return <CacheTable caches={caches} removeCache={removeCache} />
}
