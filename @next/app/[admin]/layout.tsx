import type { PropsWithChildren } from 'react'
/* Components */
import Wrapper from '@lib/components/Wrapper'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import Menu from '@common/components/layout/Menu'
import { AdminWrapperServer } from '@lib/components/admin/AdminWrapperServer'
/* Assets */
import style from './layout.module.scss'
import { notFound } from 'next/navigation'
import { isAdmin } from '@lib/utils/session'

export const metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: false,
    },
}

type Props = PropsWithChildren & {
    params: Promise<{
        admin: string
    }>
}

/**
 * Layout component that wraps the application with admin layout elements.
 * @param {ReactNode} props.children - The content to be wrapped by the layout.
 */
export default async function AdminLayout({ children, params }: Props) {
    // Admin path validation
    const { admin } = await params
    if (!admin || admin !== process.env.ADMIN_URL_PATH) {
        notFound()
    }

    // Admin credential validation
    await isAdmin()
        .then((result) => {
            if (!result) {
                notFound()
            }
        })
        .catch(() => notFound())

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
