// yarn test focus/item/route.spec.ts

import '@testing-library/jest-dom'
import { mockRequest, mockHeadersGet, mockText } from '@test/mock.route'
import { focusMessage } from '@test/fixtures'
import { PUT, DELETE } from './route'

/* Mock: logger @test/mock.logger */
jest.mock('@sujin/share/model/Logger', () => ({
    Logger: {
        error: jest.fn(),
        log: jest.fn(),
    },
}))
/* Mock: GQL @test/mock.gql */
import { client } from '@app/_lib/graphql/client'
jest.mock('@app/_lib/graphql/client', () => ({
    client: {
        mutate: jest.fn(),
    },
}))
import { NextResponse } from 'next/server'
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn(),
    },
}))

describe('focus/item/route.spec.ts', () => {
    describe('PUT()', () => {
        it('🤬 PUT() >> token invalid', async () => {
            mockHeadersGet.mockReturnValue('')

            jest.resetAllMocks()
            await PUT(mockRequest)
            expect(NextResponse.json).toHaveBeenCalledWith({ error: expect.anything() }, { status: 401 })
        })

        it('🤬 PUT() >> message empty', async () => {
            mockHeadersGet.mockReturnValue('Bearer token')
            mockText.mockReturnValue('')

            await PUT(mockRequest)
            expect(NextResponse.json).toHaveBeenCalledWith({ error: expect.anything() }, { status: 406 })
        })

        it('🤬 PUT() >> GQL rejected', async () => {
            mockHeadersGet.mockReturnValue('Bearer token')
            mockText.mockReturnValue(JSON.stringify(focusMessage))
            ;(client.mutate as jest.Mock).mockRejectedValue(new Error())

            await PUT(mockRequest)
            expect(NextResponse.json).toHaveBeenCalledWith({ error: expect.anything() }, { status: 500 })
        })

        it('⭐️ PUT() >> Success', async () => {
            mockHeadersGet.mockReturnValue('Bearer token')
            mockText.mockReturnValue(JSON.stringify(focusMessage))
            ;(client.mutate as jest.Mock).mockResolvedValue(true)

            await PUT(mockRequest)
            expect(NextResponse.json).toHaveBeenCalledWith({ message: expect.anything() }, { status: 200 })
        })
    })

    describe.only('DELETE()', () => {
        it('🤬 DELETE() >> token invalid', async () => {
            mockHeadersGet.mockReturnValue('')

            jest.resetAllMocks()
            await DELETE(mockRequest)
            expect(NextResponse.json).toHaveBeenCalledWith({ error: expect.anything() }, { status: 401 })
        })

        it('🤬 DELETE() >> message empty', async () => {
            mockHeadersGet.mockReturnValue('Bearer token')
            mockText.mockReturnValue('')

            await DELETE(mockRequest)
            expect(NextResponse.json).toHaveBeenCalledWith({ error: expect.anything() }, { status: 406 })
        })

        it('🤬 DELETE() >> GQL rejected', async () => {
            mockHeadersGet.mockReturnValue('Bearer token')
            mockText.mockReturnValue(JSON.stringify(focusMessage))
            ;(client.mutate as jest.Mock).mockRejectedValue(new Error())

            await DELETE(mockRequest)
            expect(NextResponse.json).toHaveBeenCalledWith({ error: expect.anything() }, { status: 500 })
        })

        it('🤬 DELETE() >> Not Exist', async () => {
            mockHeadersGet.mockReturnValue('Bearer token')
            mockText.mockReturnValue(JSON.stringify(focusMessage))
            ;(client.mutate as jest.Mock).mockResolvedValue({ data: { removeFocusCloudItem: 'not-exist' } })

            await DELETE(mockRequest)
            expect(NextResponse.json).toHaveBeenCalledWith({ error: expect.anything() }, { status: 404 })
        })

        it('⭐️ DELETE() >> Done', async () => {
            mockHeadersGet.mockReturnValue('Bearer token')
            mockText.mockReturnValue(JSON.stringify(focusMessage))
            ;(client.mutate as jest.Mock).mockResolvedValue({ data: { removeFocusCloudItem: 'ok' } })

            await DELETE(mockRequest)
            expect(NextResponse.json).toHaveBeenCalledWith({ message: expect.anything() }, { status: 200 })
        })
    })
})
