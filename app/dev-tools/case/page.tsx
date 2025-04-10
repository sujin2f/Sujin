/* Components */
import Wrapper from '@app/_components/Wrapper'
import { CaseToolClient } from '@app/dev-tools/case/case-tool-client'
/* CONSTANTS */
import { MENU_NAMES } from '@app/_lib/types'

export default function CaseTool() {
    return (
        <Wrapper menu={MENU_NAMES.DEV_TOOL}>
            <CaseToolClient />
        </Wrapper>
    )
}
