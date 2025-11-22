import Cached from '@sujin/share/model/Cache'
// import Logger from '@sujin/share/model/Logger'

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        await Cached.getInstance().init()
    }
}
