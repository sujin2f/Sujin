/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'

export default function DefaultBanner() {
    return (
        <Banner
            menu={MENU_NAMES.ETHER}
            excerpt="Minimizing Margin"
            title="Proof(4): Between Comparison"
            prefix="Ether"
        />
    )
}
