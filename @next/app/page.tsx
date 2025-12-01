'use server'
import React from 'react'
/* Components */
import { FrontPageClient } from '@app/front-page.client'
/* Utils */
import { backgrounds as getBackgrounds } from '@lib/apollo/queries/wordpress/backgrounds/backgrounds'
import { redisCachedRequest } from '@lib/apollo/queries/GQLRequest'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'

export default async function FrontPage() {
    async function action() {
        'use server'
        return await redisCachedRequest(async () => await getBackgrounds(), {
            key: `${COLLECTION.BACKGROUNDS}`,
        }).catch(() => [])
    }

    return <FrontPageClient action={action} />
}
