import React, { Fragment } from 'react'

import { Link } from 'src/frontend/components/Link'
import { PAGE_OFFSET } from 'src/frontend/constants/common'

interface Props {
    totalPages: number
    urlPrefix: string
    currentPage: number
}

export const Paging = (props: Props): JSX.Element => {
    const { totalPages, urlPrefix, currentPage } = props

    let entities: number[] = []

    if (totalPages !== 1) {
        const start =
            currentPage - PAGE_OFFSET > 2 ? currentPage - PAGE_OFFSET : 1
        const end =
            currentPage + PAGE_OFFSET < totalPages - 1
                ? currentPage + PAGE_OFFSET
                : totalPages

        if (start > 2) {
            entities.push(1)
            entities.push(-1)
        }

        entities = [
            ...entities,
            ...Array.from(Array(end - start + 1).keys()).map((v) => v + start),
        ]

        if (end < totalPages - 1) {
            entities.push(-1)
            entities.push(totalPages)
        }
    }

    return (
        <nav
            className="paging__container"
            role="navigation"
            aria-label="Navigate to another page"
        >
            {entities.map((entity) => {
                const url = `${urlPrefix}/page/${entity}`
                const isCurrnet = currentPage === entity
                return (
                    <Fragment key={`paging-${entity}`}>
                        {isCurrnet && (
                            <span className="paging paging--active">
                                {entity}
                            </span>
                        )}

                        {entity !== -1 && !isCurrnet && (
                            <Link to={url} className="paging">
                                {entity.toString()}
                            </Link>
                        )}

                        {entity === -1 && (
                            <div className="paging paging--hellip">
                                <span />
                                <span />
                                <span />
                            </div>
                        )}
                    </Fragment>
                )
            })}
        </nav>
    )
}
