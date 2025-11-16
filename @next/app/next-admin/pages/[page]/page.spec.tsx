// yarn test Pages.server.spec.tsx

import '@testing-library/jest-dom'
import { render, waitFor, screen, fireEvent } from '@testing-library/react'
import Cached from '@sujin/common/model/Cached'
import { VERSION } from '@sujin/common/constants/helper'
import { pageFactory } from '@jest/helpers'
import { clearMongo } from '@sujin/common/.jest/helpers'
import { PagesServer } from '../../../../.backup/admin/_components/Pages.server'
import migration from '@app/_lib/migration'
import { COLLECTION } from '@app/_lib/types'
import { count, migrate } from '@sujin/common/data/mongo/mongo'
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
const refresh = jest.fn()
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: () => null,
        refresh,
    }),
    usePathname: () => null,
}))

describe('Pages.server.spec.tsx', () => {
    beforeAll(async () => {
        await clearMongo()
        await migrate('0.0.0', VERSION, migration)
    })

    beforeEach(async () => {
        await pageFactory({
            slug: 'test1',
            title: 'Title1',
        })
        await pageFactory({
            slug: 'test2',
            title: 'Title2',
        })
        await pageFactory({
            slug: 'test3',
            title: 'Title3',
        })
    })

    afterEach(async () => {
        await clearMongo(COLLECTION.PAGE)
        await Cached.getInstance().flush()
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo()
    })

    test('<PagesServer /> has result', async () => {
        await act(async () => {
            render(await PagesServer({ page: 1 }))
        })

        await waitFor(async () => {
            const table = screen.getByTestId('admin__pages__table')
            expect(table.querySelectorAll('tbody tr').length).toBe(3)
        }).catch(() => {
            expect(false).toBeTruthy()
        })
    })

    test('<PagesServer /> delete action', async () => {
        await act(async () => {
            render(await PagesServer({ page: 1 }))
        })

        await waitFor(async () => {
            const remove = screen.getAllByText('Remove')
            if (remove.length) fireEvent.click(remove[1])
        })

        await waitFor(async () => {
            expect(refresh).toHaveBeenCalled()
        }).catch(() => {
            expect(false).toBeTruthy()
        })

        const result = await count(COLLECTION.PAGE, {})
        expect(result).toBe(2)
    })
})
