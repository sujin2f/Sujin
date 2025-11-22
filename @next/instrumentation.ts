import Cached from '@sujin/share/model/Cache'

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        await Cached.getInstance().init()
    }
}
