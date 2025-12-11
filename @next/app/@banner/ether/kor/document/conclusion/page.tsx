/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'

export default function DefaultBanner() {
    return <Banner menu={MENU_NAMES.ETHER_KOR} excerpt="결론과 후속 연구" title="결론" prefix="Ether" />
}
