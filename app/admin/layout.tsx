import React, { type PropsWithChildren } from 'react'
import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
/* Components */
import { Header } from '@app/_components/header'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Menu } from '@common/components/layout/Menu'
/* Constants */
import { authOptions } from '@app/api/auth/constants'
/* Assets */
import './style.scss'

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
                            className="menu--admin"
                            items={[
                                {
                                    title: 'Home',
                                    link: '/admin',
                                },
                                {
                                    title: 'Pages',
                                    link: '/admin/pages/1',
                                },
                                {
                                    title: 'Categories',
                                    link: '/admin/categories/1',
                                },
                                {
                                    title: 'Tags',
                                    link: '/admin/tags/1',
                                },
                                {
                                    title: 'Backgrounds',
                                    link: '/admin/backgrounds/1',
                                },
                                {
                                    title: 'Collections',
                                    link: '/admin/collections',
                                },
                                {
                                    title: 'Index',
                                    link: '/admin/index',
                                },
                                {
                                    title: 'Schema',
                                    link: '/admin/schema',
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
