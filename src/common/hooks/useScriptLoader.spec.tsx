/**
 * @jest-environment jsdom
 */
// yarn test useScriptLoader.spec.ts

import '@testing-library/jest-dom'
import React, { Fragment } from 'react'
import { render } from '@testing-library/react'
import { useScriptLoader } from './useScriptLoader'

describe('useScriptLoader.ts', () => {
    it('test', async () => {
        const Component = (): JSX.Element => {
            useScriptLoader('https://test.com/test.js')
            useScriptLoader('https://test.com/test.js')
            return <Fragment></Fragment>
        }
        render(<Component />)
        const html = document.body.innerHTML
        const matching = html.match(
            /https:\/\/test.com\/test.js/g,
        ) as RegExpMatchArray
        expect(matching.length).toBe(1)
    })
})
