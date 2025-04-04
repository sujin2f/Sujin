import Backgrounds from '@app/admin/backgrounds/[page]/Backgrounds'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Page(props: Props) {
    return <Backgrounds {...props} />
}
