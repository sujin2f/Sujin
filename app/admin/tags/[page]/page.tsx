import Tags from '@app/admin/tags/[page]/Tags'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Page(props: Props) {
    const params = await props.params
    return <Tags {...params} />
}
