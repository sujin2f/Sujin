// yarn test Categories.server.spec.tsx

import '@testing-library/jest-dom'
import { render, waitFor, screen, fireEvent } from '@testing-library/react'
import { VERSION } from '@sujin/common/constants/helper'
import { categoryFactory } from '@jest/helpers'
import { clearMongo } from '@sujin/common/.jest/helpers'
import { CategoriesServer } from './Categories.server'
import migration from '@app/_lib/migration'
import { COLLECTION } from '@app/_lib/types'
import { count, migrate } from '@sujin/common/data/mongo/mongo'
import { act } from 'react'

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

describe('Categories.server.spec.tsx', () => {
    beforeAll(async () => {
        await clearMongo()
        await migrate('0.0.0', VERSION, migration)
    })

    beforeEach(async () => {
        await categoryFactory()
        await categoryFactory()
        await categoryFactory()
    })

    afterEach(async () => {
        await clearMongo(COLLECTION.ARCHIVE)
    })

    afterAll(async () => {
        jest.clearAllMocks()
        await clearMongo()
    })

    test('<CategoriesServer /> has result', async () => {
        await act(async () => {
            render(await CategoriesServer({ page: 1 }))
        })

        await waitFor(async () => {
            const table = screen.getByTestId('admin__categories__table')
            expect(table.querySelectorAll('tbody tr').length).toBe(3)
        }).catch(() => {
            expect(false).toBeTruthy()
        })
    })

    test('<CategoriesServer /> delete action', async () => {
        await act(async () => {
            render(await CategoriesServer({ page: 1 }))
        })

        await waitFor(async () => {
            const remove = screen.getAllByText('Remove')
            if (remove.length) fireEvent.click(remove[1])
        })

        await waitFor(async () => {
            expect(refresh).toHaveBeenCalled()
            const result = await count(COLLECTION.ARCHIVE, {})
            expect(result).toBe(2)
        }).catch(() => {
            expect(false).toBeTruthy()
        })
    })
})
