/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'

export default function DefaultBanner() {
    return (
        <Banner
            menu={MENU_NAMES.ETHER_KOR}
            excerpt="오차 보정"
            title="가설의 검증(4): 비교 기준, Between"
            prefix="Ether"
        />
    )
}
