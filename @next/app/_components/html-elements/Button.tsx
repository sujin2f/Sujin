import type { ComponentProps } from 'react'

export const Button = ({ children, ...props }: ComponentProps<'button'>) => {
    const className = `inline-block bg-primary text-white border border-primary px-3 cursor-pointer ${
        props.className || ''
    }`
    return (
        <button className={className} {...props}>
            {children}
        </button>
    )
}
