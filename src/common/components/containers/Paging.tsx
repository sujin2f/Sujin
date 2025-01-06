import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import 'src/common/scss/paging.scss'

interface Props {
    totalPages: number
    urlPrefix: string
    currentPage: number
    pageOffset?: number
}

export const Paging = (props: Props) => {
    const { totalPages, urlPrefix, currentPage } = props
    const pageOffset = props.pageOffset || 5

    let entities: number[] = []

    if (totalPages !== 1) {
        const start =
            currentPage - pageOffset > 2 ? currentPage - pageOffset : 1
        const end =
            currentPage + pageOffset < totalPages - 1
                ? currentPage + pageOffset
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
            {entities.map((entity, index) => {
                const url = `${urlPrefix}/page/${entity}`
                const isCurrnet = currentPage === entity
                return (
                    <Fragment key={`paging-${entity}-${index}`}>
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
