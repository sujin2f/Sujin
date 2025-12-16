// yarn test string.spec.ts

import { phpSerialized1, phpSerialized2, phpSerialized3, phpSerialized4 } from '@test/fixture'
import { toNumber, generateUUID, phpUnSerialize } from './string'

describe('string.ts', () => {
    it('toNumber()', () => {
        expect(toNumber()).toEqual(0)
        expect(toNumber('0')).toEqual(0)
        expect(toNumber('$1,300')).toEqual(1300)
        expect(toNumber('$1,300.20')).toEqual(1300.2)
    })

    it('generateUUID()', () => {
        expect(generateUUID().length).toEqual(36)
        expect(generateUUID()).not.toEqual(generateUUID())
    })

    test('phpUnSerialize(): 1', () => {
        const result = phpUnSerialize(phpSerialized1.replaceAll(' ', '').replaceAll('\n', ''))
        expect(result).toStrictEqual({
            width: 800,
            height: 582,
            file: '2025/01/D853005F-BAF2-474B-8EFF-54EDD771729C.jpeg',
            filesize: 50332,
            sizes: {
                medium: {
                    file: 'D853005F-BAF2-474B-8EFF-54EDD771729C-300x218.jpeg',
                    width: 300,
                    height: 218,
                    'mime-type': 'image/jpeg',
                    filesize: 20469,
                },
                thumbnail: {
                    file: 'D853005F-BAF2-474B-8EFF-54EDD771729C-150x150.jpeg',
                    width: 150,
                    height: 150,
                    'mime-type': 'image/jpeg',
                    filesize: 16505,
                },
            },
            image_meta: {
                aperture: '0',
                credit: '',
                camera: '',
                caption: '',
                created_timestamp: '0',
                copyright: '',
                focal_length: '0',
                iso: '0',
                shutter_speed: '0',
                title: '',
                orientation: '0',
                keywords: {},
            },
        })
    })

    test('phpUnSerialize(): 2', () => {
        let result = phpUnSerialize(phpSerialized2)
        result = phpUnSerialize(phpSerialized3)
        expect(result).toBeTruthy()
        result = phpUnSerialize(phpSerialized4)
        expect(result).toBeTruthy()
    })

    test('phpUnSerialize(): 3', () => {
        const result = phpUnSerialize('a:2:{i:0;b:0;s:18:"nav_menu_locations";a:1:{s:7:"primary";i:19;}}')
        expect(result).toStrictEqual({ '0': 0, nav_menu_locations: { primary: 19 } })
    })
})
