import { Cached } from '@common/model/Cached'

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        await Cached.getInstance().init()
    }
}
