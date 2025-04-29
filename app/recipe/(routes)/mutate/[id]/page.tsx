import { ObjectId } from 'mongodb'
import sanitize from 'mongo-sanitize'
/* Components */
import { MutateServer } from '@app/recipe/_components/Mutate.server'

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function MutatePage({ params }: Props) {
    const { id } = await params
    const _id = id !== 'new' ? new ObjectId(sanitize(id)) : 'new'

    return <MutateServer _id={_id} />
}
