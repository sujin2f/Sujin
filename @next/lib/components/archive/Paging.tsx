import { Paging as PagingComponent } from '@app/archive/_components/Paging'

type Props = {
    readonly pages: number
    readonly page: number
    readonly urlPrefix: string
}

export const Paging = ({ pages, page, urlPrefix }: Props) => {
    return (
        <>
            {pages && pages > 1 ? (
                <PagingComponent totalPages={pages} currentPage={page} urlPrefix={urlPrefix} />
            ) : (
                <></>
            )}
        </>
    )
}
