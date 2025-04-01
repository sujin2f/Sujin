import React, { type PropsWithChildren } from 'react'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
/* Components */
import Header from '@components/header'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Menu } from '@common/components/layout/Menu'
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
                    <Column small={2}>
                        <Menu
                            items={[
                                {
                                    title: 'Post',
                                    link: '/admin/post/1',
                                },
                                {
                                    title: 'Page',
                                    link: '/admin/page/1',
                                },
                                {
                                    title: 'Term',
                                    link: '/admin/term/1',
                                },
                                {
                                    title: 'Index',
                                    link: '/admin/index',
                                },
                                {
                                    title: 'Cache',
                                    link: '/admin/cache',
                                },
                            ]}
                            direction="vertical"
                        />
                    </Column>
                    <Column small={10}>{children}</Column>
                </Row>
            </main>
        </>
    )
}
