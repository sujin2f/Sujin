import type { ComponentProps } from 'react'

export const Input = (props: ComponentProps<'input'>) => {
    const className = `border border-slate-500 w-full px-1 bg-white ${props.className || ''}`
    return <input className={className} {...props} />
}
