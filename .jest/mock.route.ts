import '@testing-library/jest-dom'
import type { NextRequest } from 'next/server'

export const mockText = jest.fn()
export const mockHeadersGet = jest.fn()
export const mockRequest = {
    text: mockText,
    headers: {
        get: mockHeadersGet,
    },
} as unknown as NextRequest
