import '@testing-library/jest-dom'
import { client } from '@app/_lib/graphql/client'
jest.mock('@app/_lib/graphql/client', () => ({
    client: {
        query: jest.fn(),
        mutate: jest.fn(),
    },
}))

import { NextResponse } from 'next/server'
jest.mock('next/server', () => ({
    NextResponse: {
        json: jest.fn(),
    },
}))
