// yarn test clients.spec.ts

import { T_PostImages } from '@sujin/lib/types'
import { getThumbnailFromPost } from './wordpress'
import { DEFAULT_THUMBNAIL } from '@app/_lib/constants'
import { IMAGE_SIZE } from '@sujin/lib/constants'

describe('clients.ts', () => {
    afterAll(() => {
        jest.clearAllMocks()
    })

    test('getThumbnailFromPost()', () => {
        const result = getThumbnailFromPost(null as unknown as T_PostImages, [IMAGE_SIZE.THUMBNAIL])
        expect(result).toBe(DEFAULT_THUMBNAIL)
    })
})
