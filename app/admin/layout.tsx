import React from 'react'
import type { PropsWithChildren } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'

import { authOptions } from '@app/api/auth/[...nextauth]/route'

import '@src/scss/admin.scss'

/**
 * Layout component that wraps the application with admin layout elements.
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export default async function AppLayout({ children }: PropsWithChildren) {
    const session = await getServerSession(authOptions)
    if (!session) {
        notFound()
    }
    if (session.user?.email !== process.env.ADMIN_EMAIL) {
        notFound()
    }
    return (
        <main className="admin">
            <nav>
                <ul>
                    <Link href="/admin/post/1">Post</Link>
                </ul>
            </nav>
            {children}
        </main>
    )
}
