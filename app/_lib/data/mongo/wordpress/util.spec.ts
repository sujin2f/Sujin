// yarn test util.spec.ts

import { IMAGE_SIZE } from '@app/_lib/types-image'
import { formatImage, formatImageBlock, formatPostImage } from './util'

const expected = {
    url: '/wp-content/uploads/test-medium.jpg',
    width: 225,
    height: 300,
    mimeType: 'image/jpeg',
}

const image = {
    ...expected,
    altText: 'test',
    title: 'test',
    caption: 'test',
    description: 'test',
}

const expectedImageBlock = {
    ...expected,
    title: 'test',
    sizes: {
        medium: expected,
        thumbnail: expected,
        mediumLarge: expected,
        large: expected,
        postThumbnail: expected,
        recentPost: expected,
    },
}

const requestImageBlock = {
    ...image,
    sizes: {
        medium: image,
        thumbnail: image,
        mediumLarge: image,
        large: image,
        postThumbnail: image,
        recentPost: image,
        additional: image,
    },
}

const expectedPostImage = {
    list: expectedImageBlock,
    icon: expectedImageBlock,
    title: expectedImageBlock,
    background: expectedImageBlock,
    thumbnail: expectedImageBlock,
}

const requestedPostImage = {
    ...expectedPostImage,
    otherLocation: expectedImageBlock,
}

describe('util.spec.ts', () => {
    test('formatImage()', async () => {
        const result = formatImage(image)
        expect(result).toStrictEqual(expected)
    })

    test('formatImageBlock()', async () => {
        const result = formatImageBlock(requestImageBlock, IMAGE_SIZE)
        expect(result).toStrictEqual(expectedImageBlock)
    })

    test('formatPostImage()', async () => {
        const result = formatPostImage(requestedPostImage)
        expect(result).toStrictEqual(expectedPostImage)
    })
})
