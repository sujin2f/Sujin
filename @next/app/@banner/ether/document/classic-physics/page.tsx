/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'

export default function DefaultBanner() {
    return (
        <Banner
            menu={MENU_NAMES.ETHER}
            excerpt="Ether from Bohr's Atomic Model"
            title="Proof(1): Classic Physics"
            prefix="Ether"
        />
    )
}
