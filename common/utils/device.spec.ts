/**
 * @jest-environment jsdom
 */
// yarn test device.spec.ts

import { isMobile, scrollTo } from './device'

describe('device.ts', () => {
    /* eslint-disable max-len,no-useless-escape */
    const dataIsMobile = [
        [
            'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36',
            true,
        ],
        [
            'Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.107 Mobile Safari/537.36',
            true,
        ],
        [
            'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 6P Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.83 Mobile Safari/537.36',
            true,
        ],
        [
            'Mozilla/5.0 (Linux; Android 6.0; HTC One M9 Build/MRA58K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.98 Mobile Safari/537.3',
            true,
        ],
        [
            'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
            true,
        ],
        [
            'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
            true,
        ],
        [
            'Mozilla/5.0 (Windows Phone 10.0; Android 6.0.1; Microsoft; RM-1152) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Mobile Safari/537.36 Edge/15.15254',
            true,
        ],
        [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
            false,
        ],
        [
            'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36',
            false,
        ],
        [
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9',
            false,
        ],
        [
            'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36',
            false,
        ],
        [
            'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1',
            false,
        ],
        [
            'Mozilla/5.0 (CrKey armv7l 1.5.16041) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.0 Safari/537.36',
            false,
        ],
        ['Roku4640X/DVP-7.70 (297.70E04154A)', false],
        [
            'Mozilla/5.0 (Linux; U; Android 4.2.2; he-il; NEO-X5-116A Build/JDQ39) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30',
            false,
        ],
        [
            'Mozilla/5.0 (Linux; Android 5.1; AFTS Build/LMY47O) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/41.99900.2250.0242 Safari/537.36',
            false,
        ],
        [
            'Mozilla/5.0 (Nintendo WiiU) AppleWebKit/536.30 (KHTML, like Gecko) NX/3.0.4.2.12 NintendoBrowser/4.3.1.11264.US',
            false,
        ],
        [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; XBOX_ONE_ED) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393',
            false,
        ],
    ]
    /* eslint-enable max-len,no-useless-escape */

    describe.each(dataIsMobile)('isMobile()', (input, expected) => {
        test(`isMobile ${input}`, () => {
            Object.defineProperty(window.navigator, 'userAgent', {
                value: input,
                configurable: true,
            })
            const actual = isMobile()
            expect(actual).toEqual(expected)
        })
    })

    describe('scrollTo()', () => {
        beforeAll(() => {
            window.scrollTo = jest.fn()
            document.body.innerHTML = `
        <section>
        <div id="first-container">First Container</div>
        <div id="second-container">Second Container</div>
        <div id="third-container">Third Container</div>
        <div id="forth-container">Forth Container</div>
        <div id="fifth-container">Fifth Container</div>
        <div id="sixth-container">Sixth Container</div>
        </section>
        <section id="second-section">Second Section</section>
        `
        })

        test('scrollTo()', () => {
            scrollTo('')
            expect(window.scrollTo).toHaveBeenCalledWith({ top: 0 })
        })

        test('scrollTo(selector)', () => {
            const result = scrollTo('#second-section')
            expect(result).toBe(0)
        })

        test('scrollTo(wrong selector)', () => {
            const result = scrollTo('#foo')
            expect(result).toBe(undefined)
        })
    })
})
