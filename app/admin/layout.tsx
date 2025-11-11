import type { PropsWithChildren } from 'react'
/* Components */
import Wrapper from '@app/_components/Wrapper'
import Row from '@sujin/common/components/layout/Row'
import Column from '@sujin/common/components/layout/Column'
import Menu from '@sujin/common/components/layout/Menu'
import { AdminWrapperServer } from '@app/_components/AdminWrapperServer'
/* Assets */
import style from '@app/admin/layout.module.scss'

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
    return (
        <AdminWrapperServer>
            <Wrapper banner={false} style={style} className={style.wrapper}>
                <Row>
                    <Column small={2}>
                        <Menu
                            className={style.menu}
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
                                    title: 'Users',
                                    link: '/admin/users/1',
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
            </Wrapper>
        </AdminWrapperServer>
    )
}
