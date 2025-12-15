import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren & {
    invert?: boolean
}

export const WidgetTitle = ({ children, invert }: Props) => {
    const className = invert ? 'border-b-white' : ''
    const classNameSpan = invert ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'

    return (
        <h2 className={`border-b-1 mb-5 leading-normal ${className}`}>
            <span className={`inline-block text-xl font-thin pr-2 pl-2 ${classNameSpan}`}>{children}</span>
        </h2>
    )
}
