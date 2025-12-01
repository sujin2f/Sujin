import React from 'react'
import type { Metadata } from 'next'
/* Components */
import { NotFoundClient } from '@app/not-found.client'
/* Utils */
import { recent } from '@lib/apollo/queries/wordpress/posts/recent'
import { redisCachedRequest } from '@lib/apollo/queries/GQLRequest'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: false,
    },
}

export default async function NotFound() {
    async function action() {
        'use server'
        return await redisCachedRequest(async () => await recent(), {
            key: `${COLLECTION.POST}-recent`,
        }).catch(() => [])
    }

    return <NotFoundClient action={action} />
}
