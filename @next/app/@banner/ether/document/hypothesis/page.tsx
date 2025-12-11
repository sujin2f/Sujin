/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'

export default function DefaultBanner() {
    return <Banner menu={MENU_NAMES.ETHER} excerpt="Brief History of the Study" title="Hypothesis" prefix="Ether" />
}
