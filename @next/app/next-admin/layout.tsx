import { notFound } from 'next/navigation'
import type { PropsWithChildren } from 'react'
import Link from 'next/link'
/* Components */
import { Main } from '@app/_components/html-elements/Main'
/* Utils */
import { isAdmin } from '@app/_lib/utils/tokens'

export const metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: false,
    },
}

/**
 * Layout component that wraps the application with admin layout elements.
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export default async function AdminLayout({ children }: PropsWithChildren) {
    if (!(await isAdmin())) notFound()

    return (
        <Main className="grid w-full max-w-2xl grid-cols-1 gap-8 xl:max-w-6xl xl:grid-cols-[var(--container-3xs)_minmax(0,1fr)]">
            <nav>
                <ul>
                    <li>
                        <Link href="/next-admin">Home</Link>
                    </li>
                    <li>
                        <Link href="/next-admin/pages/1">Pages</Link>
                    </li>
                    <li>
                        <Link href="/next-admin/posts/1">Posts</Link>
                    </li>
                    <li>
                        <Link href="/next-admin/categories/1">Categories</Link>
                    </li>
                    <li>
                        <Link href="/next-admin/tags/1">Tags</Link>
                    </li>
                    <li>
                        <Link href="/next-admin/backgrounds">Backgrounds</Link>
                    </li>
                    <li>
                        <Link href="/next-admin/flush-cache">Flush Cache</Link>
                    </li>
                    <li>
                        <Link href="/next-admin/focus">Focus</Link>
                    </li>
                </ul>
            </nav>

            <aside>{children}</aside>
        </Main>
    )
}
