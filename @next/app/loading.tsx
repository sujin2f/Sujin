/* Components */
import { Wrapper } from '@app/_components/Wrapper'
import FixedHeader from '@lib/components/header/FixedHeader'
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'
/* Assets */
import LoadingImg from '@common/images/loading.svg'

type Props = {
    readonly menu?: MENU_NAMES
}

export default async function Loading({ menu }: Props) {
    return (
        <Wrapper>
            <FixedHeader menu={menu || MENU_NAMES.MAIN} />
            <Banner title={<LoadingImg />} menu={menu || MENU_NAMES.MAIN} />
        </Wrapper>
    )
}
