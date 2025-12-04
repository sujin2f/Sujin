'use server'
import React from 'react'
/* Components */
import { FrontPageClient } from '@app/front-page.client'
/* Utils */
import { backgrounds as getBackgrounds } from '@lib/apollo/queries/wordpress/backgrounds/backgrounds'
import { gqlRequest } from '@lib/redis/client'
/* CONSTANTS */
import { COLLECTION } from '@sujin/lib/constants'

export default async function FrontPage() {
    async function action() {
        'use server'
        return await gqlRequest(async () => await getBackgrounds(), COLLECTION.BACKGROUNDS).catch(() => [])
    }

    return (
        <FrontPageClient
            action={action}
            title={`${process.env.SITE_NAME}`}
            description={`${process.env.SITE_DESCRIPTION}`}
        />
    )
}
