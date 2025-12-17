/* Components */
import { Wrapper } from '@app/_components/layout/Wrapper'
import { TopBar } from '@app/@topbar/_components'
import { Banner } from '@app/@banner/_components'
/* Assets */
import LoadingImg from '@app/_lib/images/loading.svg'

export default async function Loading() {
    return (
        <Wrapper>
            <TopBar menu="primary" />
            <Banner title={<LoadingImg />} menu="primary" />
        </Wrapper>
    )
}
