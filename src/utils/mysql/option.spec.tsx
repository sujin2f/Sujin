// yarn test option.spec.ts

import { getOption } from './option'

jest.mock('src/utils/node-cache', () => ({
    cached: {
        get: jest.fn(),
        set: jest.fn(),
    },
}))
const query = jest.fn().mockImplementation(async (query, defaultValue) => {
    return defaultValue
})
jest.mock('promise-mysql', () => ({
    createConnection: async () => ({
        query,
    }),
}))

describe('option.ts', () => {
    it('getOption', async () => {
        query.mockResolvedValueOnce([
            {
                option_value:
                    'a:6:{s:5:"width";i:1024;s:6:"height";i:683;s:4:"file";s:15:"2022/11/1-1.jpg";s:8:"filesize";i:82062;s:5:"sizes";a:6:{s:6:"medium";a:5:{s:4:"file";s:15:"1-1-300x200.jpg";s:5:"width";i:300;s:6:"height";i:200;s:9:"mime-type";s:10:"image/jpeg";s:8:"filesize";i:14468;}s:9:"thumbnail";a:5:{s:4:"file";s:15:"1-1-150x150.jpg";s:5:"width";i:150;s:6:"height";i:150;s:9:"mime-type";s:10:"image/jpeg";s:8:"filesize";i:6586;}s:12:"medium_large";a:5:{s:4:"file";s:15:"1-1-768x512.jpg";s:5:"width";i:768;s:6:"height";i:512;s:9:"mime-type";s:10:"image/jpeg";s:8:"filesize";i:79473;}s:14:"post-thumbnail";a:5:{s:4:"file";s:15:"1-1-370x200.jpg";s:5:"width";i:370;s:6:"height";i:200;s:9:"mime-type";s:10:"image/jpeg";s:8:"filesize";i:17348;}s:12:"related-post";a:5:{s:4:"file";s:15:"1-1-200x110.jpg";s:5:"width";i:200;s:6:"height";i:110;s:9:"mime-type";s:10:"image/jpeg";s:8:"filesize";i:6515;}s:11:"recent-post";a:5:{s:4:"file";s:13:"1-1-88x88.jpg";s:5:"width";i:88;s:6:"height";i:88;s:9:"mime-type";s:10:"image/jpeg";s:8:"filesize";i:3220;}}s:10:"image_meta";a:12:{s:8:"aperture";s:1:"0";s:6:"credit";s:0:"";s:6:"camera";s:0:"";s:7:"caption";s:0:"";s:17:"created_timestamp";s:1:"0";s:9:"copyright";s:0:"";s:12:"focal_length";s:1:"0";s:3:"iso";s:1:"0";s:13:"shutter_speed";s:1:"0";s:5:"title";s:0:"";s:11:"orientation";s:1:"0";s:8:"keywords";a:0:{}}}',
            },
        ])

        const result = await getOption<number>('option', 'height')
        expect(result).toBe(683)
    })
})
