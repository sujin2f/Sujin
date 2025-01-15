import { PropsWithChildren } from 'react'

import { WrapperClient } from '@app/(public)/wrapper-client'

export default function PublicLayout({ children }: PropsWithChildren) {
    return <WrapperClient>{children}</WrapperClient>
}
