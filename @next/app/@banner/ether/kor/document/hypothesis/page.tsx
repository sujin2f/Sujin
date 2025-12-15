/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'

export default function DefaultBanner() {
    return <Banner menu={MENU_NAMES.ETHER_KOR} excerpt="Brief History of the Study." title="가설 제시" prefix="Ether" />
}
