// yarn test string.spec.ts

import { currencyToNumber, generateUUID, toMongoSearchString } from './string'

describe('string.ts', () => {
    it('currencyToNumber()', () => {
        expect(currencyToNumber()).toEqual(0)
        expect(currencyToNumber('0')).toEqual(0)
        expect(currencyToNumber('$1,300')).toEqual(1300)
        expect(currencyToNumber('$1,300.20')).toEqual(1300.2)
    })

    it('generateUUID()', () => {
        expect(generateUUID().length).toEqual(36)
        expect(generateUUID()).not.toEqual(generateUUID())
    })

    it('toMongoSearchString()', () => {
        expect(
            toMongoSearchString('Amzn Mktp Ca*1w6sj6v32 Www.Amazon.Caon'),
        ).toEqual('amzn mktp ca w sj v www amazon caon')

        expect(
            toMongoSearchString('Rogers *904645215 888-764-3771 On'),
        ).toEqual('rogers on')
    })
})
