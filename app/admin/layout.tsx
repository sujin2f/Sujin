import React from 'react'
import type { PropsWithChildren } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'

import authOptions from '@app/api/auth/[...nextauth]/authOptions'

import '@src/scss/admin.scss'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'

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
            <Row>
                <Column small={3}>
                    <nav>
                        <ul>
                            <li>
                                <Link href="/admin/post/1">Post</Link>
                            </li>
                            <li>
                                <Link href="/admin/term/1">Term</Link>
                            </li>
                            <li>
                                <Link href="/admin/index">Index</Link>
                            </li>
                            <li>
                                <Link href="/admin/reset-index">
                                    Reset Index
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </Column>
                <Column small={9}>{children}</Column>
            </Row>
        </main>
    )
}
