import { Fragment } from 'react'
import Link from 'next/link'
/* Hooks */
import { usePage, type Props } from '@app/_components/layout/usePage'

const className =
    'flex items-center justify-center w-12 h-12 cursor-pointer text-primary border border-slate-300 hover:bg-primary hover:text-white transition-colors'

export const Paging = (props: Props) => {
    const entities = usePage(props)
    return (
        <nav className="flex justify-center gap-2 mb-10" role="navigation" aria-label="Navigate to page">
            {entities.map((entity, index) => (
                <Fragment key={`paging-${entity.link}-${index}`}>
                    {props.currentPage === entity.text && (
                        <span className={`${className} bg-primary text-white border-primary!`}>{entity.text}</span>
                    )}

                    {!entity.ellipsis && props.currentPage !== entity.text && (
                        <Link
                            href={entity.link}
                            className={className}
                            onClick={(e) => {
                                if (!props.onClick) return
                                e.preventDefault()
                                props.onClick(entity.text)
                            }}
                        >
                            {entity.text}
                        </Link>
                    )}

                    {entity.ellipsis && (
                        <div className={`${className} border-none gap-1`}>
                            <span className="w-1 h-1 bg-slate-300" />
                            <span className="w-1 h-1 bg-slate-300" />
                            <span className="w-1 h-1 bg-slate-300" />
                        </div>
                    )}
                </Fragment>
            ))}
        </nav>
    )
}
