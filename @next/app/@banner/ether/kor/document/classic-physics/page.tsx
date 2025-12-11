/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'

export default function DefaultBanner() {
    return (
        <Banner
            menu={MENU_NAMES.ETHER_KOR}
            excerpt="보어의 원자 모형에 기초한 광자-에테르의 방출 파장"
            title="가설의 검증(1): 고전 물리학"
            prefix="Ether"
        />
    )
}
