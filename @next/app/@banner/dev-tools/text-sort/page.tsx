/* Components */
import { Banner } from '@app/@banner/_components'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'

export default function DefaultBanner() {
    return <Banner menu={MENU_NAMES.DEV_TOOL} excerpt="Text sorting tool." title="Text Sort" />
}
