import { notFound } from 'next/navigation'
import { Wrapper } from '@app/(wordpress)/(single)/wrapper'
import { getMetadata } from '@app/(wordpress)/(single)/util'
import { getPost } from '@src/db/mysql/getPost'

type Props = {
    params: Promise<{
        date: string[]
    }>
}

const getParams = async (
    params: Promise<{
        date: string[]
    }>,
): Promise<false | [number, number, number, string]> => {
    const { date } = await params
    if (date.length !== 4) {
        return false
    }
    const year = parseInt(date[0])
    const month = parseInt(date[1])
    const day = parseInt(date[2])
    const slug = date[3]

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return false
    }

    return [year, month, day, slug]
}

export const generateMetadata = async ({ params }: Props) => {
    const result = await getParams(params)
    if (!result) {
        return {}
    }
    const [year, month, day, slug] = result
    return getMetadata(slug, year, month, day)
}

export default async function SingleLayout({ params }: Props) {
    const result = await getParams(params)
    if (!result) {
        return notFound()
    }
    const [, , , slug] = result

    const post = await getPost(slug)
    if (!post) {
        notFound()
    }
    return <Wrapper post={post} isPost={true} />
}
