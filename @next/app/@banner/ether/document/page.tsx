/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'

export default function DefaultBanner() {
    return (
        <Banner
            menu={MENU_NAMES.ETHER}
            excerpt="Hypothesis on the Spatial and Temporal Aspects of Matter."
            title="Ether"
            prefix="Ether"
        />
    )
}
