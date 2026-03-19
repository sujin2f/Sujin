import type { ComponentProps } from 'react'

type Props<T extends 'button' | 'a'> = ComponentProps<T> & {
    dom?: T
}

export const Button = <T extends 'button' | 'a'>({ dom, children, className, ...props }: Props<T>) => {
    const css = `inline-block bg-primary text-white border border-primary px-3 cursor-pointer ${className || ''}`

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
