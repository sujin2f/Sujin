import BackgroundsTable from '@components/admin/BackgroundsTable'
import getBackgrounds from '@src/db/mongo/admin/getBackgrounds'
import { mongoIdToString } from '@common/utils/object'
import { PrevNext } from '@components/wordpress/single/PrevNext'
import type { Post } from '@src/types/wordpress'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function AdminBackgrounds(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    const backgrounds = await getBackgrounds()

    const prev =
        page !== 1
            ? ({
                  title: 'Prev',
                  link: `/admin/backgrounds/${page - 1}`,
              } as Post)
            : undefined
    const next = {
        title: 'Next',
        link: `/admin/backgrounds/${page + 1}`,
    } as Post

    return (
        <>
            <BackgroundsTable backgrounds={mongoIdToString(...backgrounds)} />
            <PrevNext posts={[prev, next]} />
        </>
    )
}
