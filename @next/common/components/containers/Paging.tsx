import React, { Fragment } from 'react'
import Link from 'next/link'

interface Props {
    totalPages: number
    urlPrefix: string
    currentPage: number
    pageOffset?: number
}

const className =
    'flex items-center justify-center w-12 aspect-square cursor-pointer text-primary border border-slate-300 text-center'

export const Paging = (props: Props) => {
    const { totalPages, urlPrefix, currentPage } = props
    const pageOffset = props.pageOffset || 5

    let entities: number[] = []

    if (totalPages !== 1) {
        const start = currentPage - pageOffset > 2 ? currentPage - pageOffset : 1
        const end = currentPage + pageOffset < totalPages - 1 ? currentPage + pageOffset : totalPages

        if (start > 2) {
            entities.push(1)
            entities.push(-1)
        }

        entities = [...entities, ...Array.from(Array(end - start + 1).keys()).map((v) => v + start)]

        if (end < totalPages - 1) {
            entities.push(-1)
            entities.push(totalPages)
        }
    }

    return (
        <nav className="flex justify-center gap-2 mb-10" role="navigation" aria-label="Navigate to page">
            {entities.map((entity, index) => {
                const url = `${urlPrefix}/${entity}`
                const isCurrent = currentPage.toString() === entity.toString()

                return (
                    <Fragment key={`paging-${entity}-${index}`}>
                        {isCurrent && (
                            <span className={`${className} bg-primary text-white border-primary!`}>{entity}</span>
                        )}

                        {entity !== -1 && !isCurrent && (
                            <Link href={url} className={className}>
                                {entity.toString()}
                            </Link>
                        )}

                        {entity === -1 && (
                            <div className={`${className} border-none gap-1`}>
                                <span className="w-1 h-1 bg-slate-300" />
                                <span className="w-1 h-1 bg-slate-300" />
                                <span className="w-1 h-1 bg-slate-300" />
                            </div>
                        )}
                    </Fragment>
                )
            })}
        </nav>
    )
}
