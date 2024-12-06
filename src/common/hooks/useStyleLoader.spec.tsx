/**
 * @jest-environment jsdom
 */
// yarn test useStyleLoader.spec.ts

import '@testing-library/jest-dom'
import React, { Fragment } from 'react'
import { render } from '@testing-library/react'
import { useStyleLoader } from './useStyleLoader'

describe('useStyleLoader.ts', () => {
    it('test', async () => {
        const Component = (): JSX.Element => {
            useStyleLoader(
                'https://test.com/test1.css',
                'https://test.com/test2.css',
            )
            useStyleLoader(
                'https://test.com/test1.css',
                'https://test.com/test2.css',
            )
            return <Fragment></Fragment>
        }
        render(<Component />)
        const html = document.head.innerHTML
        const matching1 = html.match(
            /https:\/\/test.com\/test1.css/g,
        ) as RegExpMatchArray
        const matching2 = html.match(
            /https:\/\/test.com\/test2.css/g,
        ) as RegExpMatchArray
        expect(matching1.length).toBe(1)
        expect(matching2.length).toBe(1)
    })
})
