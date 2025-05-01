// yarn test front-page.spec.tsx

import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import Cached from '@common/model/Cached'
import { VERSION } from '@common/constants/helper'
import { backgroundFactory } from '@jest/helpers'
import { clearMongo } from '@common/.jest/helpers'
import { FrontPage } from './front-page'
import migration from '@app/_lib/migration'
import { COLLECTION } from '@app/_lib/types'
import { closeConnection, migrate } from '@common/data/mongo/mongo'

jest.mock('next/cache', () => ({
    unstable_cache: (fn: unknown) => fn,
}))
jest.mock('next-auth', () => ({
    getServerSession: jest.fn(async () =>
        Promise.resolve({
            user: {
                email: process.env.ADMIN_EMAIL,
            },
        }),
    ),
}))
// Mock useRouter:
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: () => null,
        }
    },
    usePathname: () => null,
}))

describe('front-page.spec.tsx', () => {
    beforeAll(async () => {
        await clearMongo()
        await migrate('0.0.0', VERSION, migration)
    })

    afterEach(async () => {
        await clearMongo(COLLECTION.BACKGROUNDS)
        await Cached.getInstance().flush()
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo()
        await closeConnection()
    })

    test('<FrontPage /> has background', async () => {
        await backgroundFactory()
        await backgroundFactory()
        await backgroundFactory()

        let src = ''
        await waitFor(async () => {
            render(await FrontPage())
            src = screen.getByRole('presentation').getAttribute('src') || ''
        })
        expect(src).toContain('wp-content')
    })
})
