import sanitize from 'mongo-sanitize'
import { ObjectId } from 'mongodb'
/* Components */
import { ItemServer } from '../../_components/Item.server'

type Props = {
    params: Promise<{
        id: string
    }>
}

export default async function ItemPage(props: Props) {
    const params = await props.params
    const id = new ObjectId(sanitize(params.id))
    return <ItemServer id={id} />
}
