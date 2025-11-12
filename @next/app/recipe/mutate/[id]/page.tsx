import { ObjectId } from 'mongodb'
/* Components */
import { MutateServer } from '../../_components/Mutate.server'

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function MutatePage({ params }: Props) {
    const { id } = await params
    return <MutateServer _id={new ObjectId(id)} />
}
