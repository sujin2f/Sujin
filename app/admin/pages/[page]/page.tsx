import Pages from '@app/admin/pages/Pages'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Page(props: Props) {
    return <Pages {...props} />
}
