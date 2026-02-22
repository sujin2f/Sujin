export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // eslint-disable-next-line no-console
        console.log(`👀 graphql endpoints: ${process.env.GQL_BASE_URL}`)
        // eslint-disable-next-line no-console
        console.log(`👀 auth endpoints: ${process.env.AUTH_BASE_URL}`)
    }
}
