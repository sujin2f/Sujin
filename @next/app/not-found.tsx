import React from 'react'
import type { Metadata } from 'next'
/* Components */
import { NotFoundClient } from '@app/not-found.client'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: false,
    },
}

export default async function NotFound() {
    return <NotFoundClient />
}
