import React, { PropsWithChildren } from 'react'

import { Footer } from '@components/footer'

export default function Layout({ children }: PropsWithChildren) {
    return (
        <>
            {children}
            <Footer />
        </>
    )
}
