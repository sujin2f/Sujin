// yarn test About.server.spec.tsx

import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { AboutServer } from './About.server'

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
    test('<AboutServer /> has heading', async () => {
        const result = render(await AboutServer())
        const h1 = await result.findByText('About Test')
        expect(h1.nodeName).toMatch(/h1/i)
    })
})
