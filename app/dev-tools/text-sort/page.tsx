/* Components */
import Wrapper from '@app/_components/Wrapper'
import { TextSortClient } from '@app/dev-tools/text-sort/text-sort-client'
/* CONSTANTS */
import { MENU_NAMES } from '@app/_lib/types'

export default function CaseTool() {
    return (
        <Wrapper menu={MENU_NAMES.DEV_TOOL}>
            <TextSortClient />
        </Wrapper>
    )
}
