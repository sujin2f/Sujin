import type { PropsWithChildren } from 'react'
/* Components */
import Row from '@common-old/components/layout/Row'
import Column from '@common-old/components/layout/Column'

type Props = {
    title: string
}

export const Header = ({ title, children }: PropsWithChildren<Props>) => {
    return (
        <Row fullWidth>
            <Column small={12}>
                <h1>{title}</h1>
            </Column>
            <Column small={12}>{children}</Column>
        </Row>
    )
}

export default Header
