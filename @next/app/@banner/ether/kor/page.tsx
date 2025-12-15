/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'

export default function DefaultBanner() {
    return (
        <Banner menu={MENU_NAMES.ETHER_KOR} excerpt="물질의 공간성과 시간성에 대한 가설" title="Ether" prefix="Ether" />
    )
}
