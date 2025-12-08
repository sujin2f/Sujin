import React from 'react'
import type { Metadata } from 'next'
/* Components */
import { NotFoundClient } from '@app/not-found.client'
import { Wrapper } from '@lib/components/Wrapper'
import { Footer } from '@app/@footer/_components'
import FixedHeader from '@lib/components/header/FixedHeader'
import { Banner } from '@app/@banner/_components'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
/* Utils */
import { getRecent } from '@app/blog/_lib/getRecent'
/* CONSTANTS */
import { MENU_NAMES } from '@sujin/lib/constants'

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
        return await getRecent()
    }

    return (
        <Wrapper>
            <FixedHeader menu={MENU_NAMES.MAIN} />
            <Banner
                title="404 Not Found"
                excerpt="We cannot find the result. See below for recent articles."
                menu={MENU_NAMES.MAIN}
            />
            <Row>
                <Column>
                    <NotFoundClient action={action} />
                </Column>
            </Row>

            <Footer />
        </Wrapper>
    )
}
