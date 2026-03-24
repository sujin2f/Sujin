import type { ComponentProps } from 'react'

type Props<T extends 'button' | 'a'> = ComponentProps<T> & {
    dom?: T
    padding?: boolean
}

export const Button = <T extends 'button' | 'a'>({ dom, children, className, padding = true, ...props }: Props<T>) => {
    const css = `bg-primary text-white border border-primary cursor-pointer ${className || ''} ${padding && 'px-3'}`

    if (dom === 'a') {
        return (
            <a className={css} {...(props as ComponentProps<'a'>)}>
                {children}
            </a>
        )
    }

    return (
        <button className={css} {...(props as ComponentProps<'button'>)}>
            {children}
        </button>
    )
}
