/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'

export default function DefaultBanner() {
    return (
        <Banner
            menu={MENU_NAMES.ETHER_KOR}
            excerpt="관측값과의 비교"
            title="가설의 검증(3): 방출 에너지 분석"
            prefix="Ether"
        />
    )
}
