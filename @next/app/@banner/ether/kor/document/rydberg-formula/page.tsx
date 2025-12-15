/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'

export default function DefaultBanner() {
    return (
        <Banner
            menu={MENU_NAMES.ETHER_KOR}
            excerpt="다전자원자에서 뤼드베리 방정식 적용"
            title="가설의 검증(2): 뤼드베리 방정식"
            prefix="Ether"
        />
    )
}
