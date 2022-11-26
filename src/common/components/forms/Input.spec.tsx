/**
 * @jest-environment jsdom
 */
// yarn test Input.spec.ts

import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import { Input } from './Input'

describe('Input.ts', () => {
    it('Basic', async () => {
        const Component = (): JSX.Element => (
            <Input id="input" helpText="helpText" label="label" />
        )
        const result = render(<Component />)
        const label = result.container.querySelector('.form-label')
        const input = result.container.querySelector('#input')
        expect(label).toBeTruthy()
        expect(input).toBeTruthy()
    })

    it('Other Options', async () => {
        const Component = (): JSX.Element => (
            <Input
                required
                inlineLabel="inlineLabel"
                label="label"
                errorMessage="errorMessage"
            />
        )
        const result = render(<Component />)
        const label = result.container.querySelector('.form-label')
        const inputGroup = result.container.querySelector('.input-group')
        expect(label).toBeTruthy()
        expect(inputGroup).toBeTruthy()
    })
})
