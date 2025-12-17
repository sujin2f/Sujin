import { notFound } from 'next/navigation'
import type { PropsWithChildren } from 'react'
/* Components */
import { TopBar } from '@app/@topbar/_components'
import { Wrapper } from '@app/_components/layout/Wrapper'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { Footer } from '@app/@footer/_components'
/* Utils */
import { isAdmin } from '@lib/utils/server/header'

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
        <Wrapper>
            <TopBar menu="primary" />
            <Row>
                <Column small={2}>
                    {/* <Menu
                        items={[
                            {
                                title: 'Home',
                                link: '/next-admin',
                            },
                            {
                                title: 'Pages',
                                link: '/next-admin/pages/1',
                            },
                            {
                                title: 'Posts',
                                link: '/next-admin/posts/1',
                            },
                            {
                                title: 'Categories',
                                link: '/next-admin/categories/1',
                            },
                            {
                                title: 'Tags',
                                link: '/next-admin/tags/1',
                            },
                            {
                                title: 'Backgrounds',
                                link: '/next-admin/backgrounds',
                            },
                            {
                                title: 'Flush Cache',
                                link: '/next-admin/flush-cache',
                            },
                        ]}
                        direction="vertical"
                    /> */}
                </Column>
                <Column small={10}>{children}</Column>
            </Row>
            <Footer />
        </Wrapper>
    )
}
