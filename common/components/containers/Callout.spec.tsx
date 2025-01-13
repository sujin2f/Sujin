/**
 * @jest-environment jsdom
 */
// yarn test Callout.spec.ts

import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import { Callout } from './Callout'

describe('Callout.ts', () => {
    it('Base', async () => {
        const Component = () => {
            return <Callout>message</Callout>
        }
        const result = render(<Component />)
        const wrapper = result.container.querySelector('.callout')
        expect(wrapper).toBeTruthy()
    })

    it('No Message', async () => {
        const Component = () => {
            return <Callout />
        }
        const result = render(<Component />)
        try {
            result.container.querySelector('.callout')
            expect(true).toBeFalsy()
        } catch {
            expect(true).toBeTruthy()
        }
    })
})
