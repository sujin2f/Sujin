/* Components */
import Wrapper from '@app/_components/Wrapper'
import { ComponentsClient } from './Components.client'
/* CONSTANTS */
import { MENU_NAMES } from '@app/_lib/types'

export async function ComponentsServer() {
    return (
        <Wrapper
            title="Components"
            prefix="Design System"
            menu={MENU_NAMES.DESIGN_SYSTEM}
        >
            <ComponentsClient />
        </Wrapper>
    )
}
