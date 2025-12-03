// yarn test spectra.spec.ts

// Mock Spectra model
import { SpectraMock } from '@test/mocks/GQL-model'
jest.doMock('@src/schema/spectra', () => SpectraMock)
import { Spectra } from '@src/schema/spectra'
// Mock Logger
import LoggerMock from '@test/mocks/utils/logger'
jest.doMock('@sujin/share/model/Logger', () => LoggerMock)
// Mock global fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        text: () => Promise.resolve(NISTresponseH),
    }),
) as jest.Mock

import { NISTresponseH } from '@test/fixture'
import { spectrum } from './spectrum'

describe('spectra.spec.ts', () => {
    test('request', async () => {
        await spectrum(1, 1)
        expect(Spectra.insertOne).toHaveBeenCalledTimes(595)
    }, 10000)
})
