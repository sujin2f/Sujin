import React, { type PropsWithChildren } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
/* Components */
import Header from '@components/header'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
/* Utils */
import authOptions from '@app/api/auth/[...nextauth]/authOptions'

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
        <>
            <Header />
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
                                    <Link href="/admin/cache">Cache</Link>
                                </li>
                            </ul>
                        </nav>
                    </Column>
                    <Column small={9}>{children}</Column>
                </Row>
            </main>
        </>
    )
}
