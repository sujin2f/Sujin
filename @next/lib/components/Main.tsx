import type { PropsWithChildren } from 'react'
/* Utils */
import { joinClassNames } from '@sujin/share/utils/string'

type Props = PropsWithChildren & {
    readonly style?: Record<string, string>
}

/**
 * Layout component
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export function Main({ children, style }: PropsWithChildren<Props>) {
    return (
        <main className={joinClassNames('main', style?.main)}>{children}</main>
    )
}
