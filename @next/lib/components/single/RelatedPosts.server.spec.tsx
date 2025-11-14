// yarn test RelatedPosts.server.spec.tsx

import '@testing-library/jest-dom'
import { render, waitFor, screen } from '@testing-library/react'
import Cached from '@sujin/node-cache'
import { VERSION } from '@sujin/share/constants/helper'
import { categoryFactory, postFactory } from '@jest/helpers'
import { clearMongo } from '@sujin/common/.jest/helpers'
import { RelatedPosts } from './RelatedPosts'
import migration from '@app/_lib/migration'
import { COLLECTION } from '@app/_lib/types'
import { migrate } from '@sujin/common/data/mongo/mongo'
import { act } from 'react'

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

describe('RelatedPosts.server.spec.tsx', () => {
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

        await act(async () => {
            render(await RelatedPosts({ slug: 'test' }))
        })

        await waitFor(async () => {
            const title1 = await screen.findByAltText('Title1')
            const title2 = await screen.findByAltText('Title2')
            expect(title2.classList.contains('card__image')).toBeTruthy()
            expect(title1.classList.contains('card__image')).toBeTruthy()
        }).catch(() => {
            expect(false).toBeTruthy()
        })
    })
})
