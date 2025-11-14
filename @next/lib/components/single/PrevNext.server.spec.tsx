// yarn test PrevNext.server.spec.tsx

import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import Cached from '@sujin/node-cache'
import { VERSION } from '@sujin/share/constants/helper'
import { categoryFactory, postFactory } from '@jest/helpers'
import { clearMongo } from '@sujin/common/.jest/helpers'
import { PrevNext } from './PrevNext.post'
import migration from '@app/_lib/migration'
import { COLLECTION } from '@app/_lib/types'
import { migrate } from '@sujin/common/data/mongo/mongo'

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

describe('PrevNext.server.spec.tsx', () => {
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

    test('<PrevNext /> has result', async () => {
        const category = await categoryFactory()

        await postFactory({
            date: new Date('1977-01-01'),
            title: 'Title1',
            archives: [category._id],
        })
        await postFactory({
            date: new Date('1977-01-02'),
            slug: 'test',
            archives: [category._id],
        })
        await postFactory({
            date: new Date('1977-01-03'),
            title: 'Title2',
            archives: [category._id],
        })

        const result = render(await PrevNext({ slug: 'test' }))
        const item1 = await result.findByText('Title1')
        const item2 = await result.findByText('Title2')

        expect(item1.classList.contains('prev-next__link__title')).toBeTruthy()
        expect(item2.classList.contains('prev-next__link__title')).toBeTruthy()
    })
})
