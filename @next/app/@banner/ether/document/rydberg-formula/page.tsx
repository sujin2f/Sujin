/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@lib/constants'

export default function DefaultBanner() {
    return (
        <Banner
            menu={MENU_NAMES.ETHER}
            excerpt="Rydberg Formula for Multi Electron Atoms"
            title="Proof(2): Reinterpretation of Rydberg Formula"
            prefix="Ether"
        />
    )
}
