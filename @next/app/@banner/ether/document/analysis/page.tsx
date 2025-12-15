/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'

export default function DefaultBanner() {
    return (
        <Banner
            menu={MENU_NAMES.ETHER}
            excerpt="Comparing with Actual Data"
            title="Proof(3): Emission Energy Analysis"
            prefix="Ether"
        />
    )
}
