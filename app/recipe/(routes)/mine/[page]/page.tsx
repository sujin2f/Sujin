import { ObjectId } from 'mongodb'
/* Components */
import { ListServer } from '@app/recipe/_components/List.server'
/* Models */
import { A_Error, ForbiddenError, UnauthorizedError } from '@common/model/Error'
/* Utils */
import { getCurrentUser } from '@app/api/auth/_lib/utils-server'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function ListMinePage(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    const userId = await getCurrentUser()
        .then((user) => user._id)
        .catch((e) => {
            if (e instanceof UnauthorizedError) {
                throw new ForbiddenError('You must log-in for this service.')
                    .setCause(e)
                    .log()
            }
            if (e instanceof A_Error) {
                e.log()
            }
            throw e
        })

    return (
        <ListServer
            page={page}
            userId={new ObjectId(userId)}
            title="My Recipes"
        />
    )
}
