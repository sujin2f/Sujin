// yarn test focus/items/route.spec.ts

import '@testing-library/jest-dom'
import { mockRequest, mockHeadersGet, mockText } from '@test/mock.route'
import { focusMessage } from '@test/fixtures'
import { GET } from './route'

/* Mock: logger @test/mock.logger */
jest.mock('@sujin/share/model/Logger', () => ({
    Logger: {
        error: jest.fn(),
        log: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
    },
}))
/* Mock: GQL @test/mock.gql */
import { client } from '@app/_lib/graphql/client'
jest.mock('@app/_lib/graphql/client', () => ({
    client: {
        query: jest.fn(),
    },
}))
import { NextResponse } from 'next/server'
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn(),
    },
}))

describe('focus/items/route.spec.ts', () => {
    describe('GET', () => {
        it('🤬 GET() >> token invalid', async () => {
            mockHeadersGet.mockReturnValue('')

            jest.resetAllMocks()
            await GET(mockRequest)
            expect(NextResponse.json).toHaveBeenCalledWith({ error: expect.anything() }, { status: 401 })
        })

        it('🤬 GET() >> GQL rejected', async () => {
            mockHeadersGet.mockReturnValue('Bearer token')
            mockText.mockReturnValue(JSON.stringify(focusMessage))
            ;(client.query as jest.Mock).mockRejectedValue(new Error())

            await GET(mockRequest)
            expect(NextResponse.json).toHaveBeenCalledWith({ error: expect.anything() }, { status: 500 })
        })

        it('⭐️ GET() >> Success / Empty', async () => {
            mockHeadersGet.mockReturnValue('Bearer token')
            mockText.mockReturnValue(JSON.stringify(focusMessage))
            ;(client.query as jest.Mock).mockResolvedValue({ data: { focusCloudItems: [] } })

            await GET(mockRequest)
            expect(NextResponse.json).toHaveBeenCalledWith({ result: expect.anything() }, { status: 404 })
        })

        it('⭐️ GET() >> Success', async () => {
            mockHeadersGet.mockReturnValue('Bearer token')
            mockText.mockReturnValue(JSON.stringify(focusMessage))
            ;(client.query as jest.Mock).mockResolvedValue({ data: { focusCloudItems: [''] } })

            await GET(mockRequest)
            expect(NextResponse.json).toHaveBeenCalledWith({ result: expect.anything() }, { status: 200 })
        })
    })
})
