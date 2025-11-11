import Row from '@sujin/common/components/layout/Row'
import Column from '@sujin/common/components/layout/Column'
import { Paging as PagingComponent } from '@sujin/common/components/containers/Paging'

type Props = {
    readonly pages: number
    readonly page: number
    readonly urlPrefix: string
}

export const Paging = ({ pages, page, urlPrefix }: Props) => {
    return (
        <Row>
            <Column small={12}>
                {pages && pages > 1 ? (
                    <PagingComponent
                        totalPages={pages}
                        currentPage={page}
                        urlPrefix={urlPrefix}
                    />
                ) : (
                    <></>
                )}
            </Column>
        </Row>
    )
}
