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
        MYSQL: process.env.MYSQL,
        MYSQL_USER: process.env.MYSQL_USER,
        MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
        MYSQL_DB: process.env.MYSQL_DB,
        FLICKR_ID: process.env.FLICKR_ID,
        NEXT_PUBLIC_GOOGLE_AD_CLIENT: process.env.NEXT_PUBLIC_GOOGLE_AD_CLIENT,
        NEXT_PUBLIC_FOOTER_GOOGLE_AD_SLOT:
            process.env.NEXT_PUBLIC_FOOTER_GOOGLE_AD_SLOT,
        NEXT_PUBLIC_SIDEBAR_GOOGLE_AD_SLOT:
            process.env.NEXT_PUBLIC_SIDEBAR_GOOGLE_AD_SLOT,
        MONGO: process.env.MONGO,
        MONGO_DATABASE: process.env.MONGO_DATABASE,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        ADMIN_EMAIL: process.env.ADMIN_EMAIL,
        GRAPHQL_ALLOW_ORIGINS: process.env.GRAPHQL_ALLOW_ORIGINS,
    }

    Logger.server('Server started with env variables:', env)
}
