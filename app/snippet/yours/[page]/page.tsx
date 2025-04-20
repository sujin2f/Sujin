import { authOptions } from '@app/api/auth/constants'
import { PrivateServer } from '@app/snippet/snippet-private.server'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function SnippetPrivate(props: Props) {
    const params = await props.params
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
        return notFound()
    }
    const page = parseInt(params.page)

    return <PrivateServer page={page} email={session.user.email} />
}
