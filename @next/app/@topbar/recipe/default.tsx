/* Components */
import { TopBar } from '@app/@topbar/_components'
import { MENU_NAMES } from '@lib/constants'

export default function DefaultTapBar() {
    return <TopBar menu={MENU_NAMES.RECIPE} />
}
