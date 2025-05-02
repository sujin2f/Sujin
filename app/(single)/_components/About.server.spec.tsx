// yarn test About.server.spec.tsx

import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import Cached from '@common/model/Cached'
import { VERSION } from '@common/constants/helper'
import { pageFactory } from '@jest/helpers'
import { clearMongo } from '@common/.jest/helpers'
import { AboutServer } from './About.server'
import migration from '@app/_lib/migration'
import { COLLECTION } from '@app/_lib/types'
import { migrate } from '@common/data/mongo/mongo'

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

describe('About.server.spec.tsx', () => {
    beforeAll(async () => {
        await clearMongo()
        await migrate('0.0.0', VERSION, migration)
    })

    afterEach(async () => {
        await clearMongo(COLLECTION.PAGE)
        await Cached.getInstance().flush()
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo()
    })

    test('<AboutServer /> has heading', async () => {
        await pageFactory({ slug: 'about', title: 'About Test' })

        const result = render(await AboutServer())
        const h1 = await result.findByText('About Test')
        expect(h1.nodeName).toMatch(/h1/i)
    })
})
