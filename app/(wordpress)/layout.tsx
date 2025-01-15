import { PropsWithChildren } from 'react'

import { WrapperClient } from '@app/(wordpress)/wrapper-client'

export default function PublicLayout({ children }: PropsWithChildren) {
    return <WrapperClient>{children}</WrapperClient>
}
