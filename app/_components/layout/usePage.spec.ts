// yarn test usePage.spec.ts

import '@testing-library/jest-dom'
import { usePage } from './usePage'

describe('usePage.spec.ts', () => {
    it('Paging is not available', async () => {
        const pages = usePage({ totalPages: 1, urlPrefix: '', currentPage: 1, pageOffset: 5 })
        expect(pages.length).toBe(0)
    })

    it('total 20, current 9', async () => {
        const pages = usePage({ totalPages: 20, urlPrefix: '', currentPage: 9, pageOffset: 3 })
        expect(pages).toStrictEqual([
            { text: 1, link: '/1', ellipsis: false },
            { text: -1, link: '', ellipsis: true },
            { text: 6, link: '/6', ellipsis: false },
            { text: 7, link: '/7', ellipsis: false },
            { text: 8, link: '/8', ellipsis: false },
            { text: 9, link: '/9', ellipsis: false },
            { text: 10, link: '/10', ellipsis: false },
            { text: 11, link: '/11', ellipsis: false },
            { text: 12, link: '/12', ellipsis: false },
            { text: -1, link: '', ellipsis: true },
            { text: 20, link: '/20', ellipsis: false },
        ])
    })

    it('total 20, current 2', async () => {
        const pages = usePage({ totalPages: 20, urlPrefix: '', currentPage: 2, pageOffset: 3 })
        expect(pages).toStrictEqual([
            { text: 1, link: '/1', ellipsis: false },
            { text: 2, link: '/2', ellipsis: false },
            { text: 3, link: '/3', ellipsis: false },
            { text: 4, link: '/4', ellipsis: false },
            { text: 5, link: '/5', ellipsis: false },
            { text: -1, link: '', ellipsis: true },
            { text: 20, link: '/20', ellipsis: false },
        ])
    })

    it('total 20, current 18', async () => {
        const pages = usePage({ totalPages: 20, urlPrefix: '', currentPage: 18, pageOffset: 3 })
        expect(pages).toStrictEqual([
            { text: 1, link: '/1', ellipsis: false },
            { text: -1, link: '', ellipsis: true },
            { text: 15, link: '/15', ellipsis: false },
            { text: 16, link: '/16', ellipsis: false },
            { text: 17, link: '/17', ellipsis: false },
            { text: 18, link: '/18', ellipsis: false },
            { text: 19, link: '/19', ellipsis: false },
            { text: 20, link: '/20', ellipsis: false },
        ])
    })
})
