import Cached from '@common/model/Cached'
import Logger from '@common/model/Logger'

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        await Cached.getInstance().init()
    }

    const env = {
        NEXT_PUBLIC_VERSION: process.env.NEXT_PUBLIC_VERSION,
        NEXT_PUBLIC_TITLE: process.env.NEXT_PUBLIC_TITLE,
        NEXT_PUBLIC_EXCERPT: process.env.NEXT_PUBLIC_EXCERPT,
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        GRAPHQL_ALLOW_ORIGINS: process.env.GRAPHQL_ALLOW_ORIGINS,
    }

    Logger.server('Server started with env variables:', env)
}
