type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function ListPage(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)

    return (
        <article>
            <h2>Recipes as;df nasdfljhb</h2>
            List {page}
        </article>
    )
}
