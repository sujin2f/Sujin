import Cached from '@sujin/share/model/Cache'

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        Cached.getInstance()

        // eslint-disable-next-line no-console
        console.log(
            `👀 graphql endpoints: ${process.env.NEXT_PUBLIC_GQL_ENDPOINT} ${process.env.GQL_ENDPOINT_INTERNAL}`,
        )
    }
}
