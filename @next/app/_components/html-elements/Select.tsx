import type { ComponentProps } from 'react'

export const Select = ({ children, ...props }: ComponentProps<'select'>) => {
    const className = `border border-slate-500 w-full px-1 bg-white py-1.5 ${props.className || ''}`
    return (
        <select className={className} {...props}>
            {children}
        </select>
    )
}
