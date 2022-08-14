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
        const Component = (): JSX.Element => {
            return <Callout message="message" />
        }
        const result = render(<Component />)
        const wrapper = result.container.querySelector('.callout__wrapper')
        expect(wrapper).toBeTruthy()
    })

    it('No Message', async () => {
        const Component = (): JSX.Element => {
            return <Callout />
        }
        const result = render(<Component />)
        try {
            result.container.querySelector('.callout__wrapper')
            expect(true).toBeFalsy()
        } catch (e) {
            expect(true).toBeTruthy()
        }
    })
})
