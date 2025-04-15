// yarn test object.spec.ts

import { filterEmpty, isEmpty, omit, schemaFormatter } from './object'

describe('object.ts', () => {
    it('filterEmpty()', () => {
        const testData = {
            a: 'a',
            b: '',
            c: 0,
            d: {},
            e: [[], []],
            f: undefined,
            g: null,
            h: NaN,
        }
        const result = filterEmpty(testData)
        expect(Object.keys(result).length).toEqual(1)
        expect(result.a).toEqual('a')
    })

    it('isEmpty(): string, empty', () => {
        const result = isEmpty('')
        expect(result).toBe(true)
    })

    it('isEmpty(): number, empty', () => {
        const result = isEmpty(NaN)
        expect(result).toBe(true)
    })

    it('isEmpty(): null', () => {
        const result = isEmpty(null)
        expect(result).toBe(true)
    })

    it('omit(): null', () => {
        const input = {
            key1: 'value1',
            key2: 'value2',
            key3: 'value3',
            key4: 'value4',
        }
        const result = omit(input, 'key1', 'key2')
        expect(result).toStrictEqual({
            key3: 'value3',
            key4: 'value4',
        })
    })

    describe('formatter()', () => {
        test('formatter(): 🤩 required failed', async () => {
            const result = schemaFormatter(
                { id: 1 },
                {
                    bsonType: 'object',
                    required: ['id'],
                    properties: {
                        id: {
                            bsonType: 'int',
                        },
                    },
                },
            )
            expect(result).toBeTruthy()
        })

        test('formatter(): 🤬 required failed', async () => {
            try {
                schemaFormatter(
                    {},
                    {
                        bsonType: 'object',
                        required: ['id'],
                        properties: {
                            id: {
                                bsonType: 'int',
                            },
                        },
                    },
                )
                expect(true).toBeFalsy()
            } catch {}
            expect(true).toBeTruthy()
        })

        test('formatter(): 🤩', async () => {
            const date = new Date()
            const result = schemaFormatter(
                {
                    id: 1,
                    title: 'test',
                    date,
                    private: false,
                    terms: [{ id: 1 }],
                    extra: 1,
                    level: 9,
                },
                {
                    bsonType: 'object',
                    required: ['id'],
                    properties: {
                        id: {
                            bsonType: 'int',
                        },
                        title: {
                            bsonType: 'string',
                        },
                        date: {
                            bsonType: 'date',
                        },
                        private: {
                            bsonType: 'bool',
                        },
                        terms: {
                            bsonType: 'array',
                            items: {
                                bsonType: 'object',
                                properties: {
                                    id: { bsonType: 'int' },
                                },
                            },
                        },
                        level: {
                            bsonType: 'int',
                            enum: [1, 2, 3],
                        },
                    },
                },
            )
            expect(result).toStrictEqual({
                id: 1,
                title: 'test',
                date,
                private: false,
                terms: [{ id: 1 }],
            })
        })
    })
})
