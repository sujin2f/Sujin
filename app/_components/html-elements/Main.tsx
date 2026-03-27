import { createElement, type ComponentProps, type JSX, type JSXElementConstructor } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ElementProps = keyof JSX.IntrinsicElements | JSXElementConstructor<any>

type Props<T extends ElementProps> = {
    dom: T
} & ComponentProps<T>

export const Main = <T extends ElementProps>({
    children,
    dom = 'main',
    className: _className = '',
    ...props
}: Props<T>) => {
    const className = `container mx-auto my-15 px-3 ${_className || ''}`
    return createElement(dom, { className, ...props }, children)
}
