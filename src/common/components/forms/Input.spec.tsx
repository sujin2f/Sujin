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
        const Component = () => (
            <Input id="input" helpText="helpText" label="label" />
        )
        const result = render(<Component />)
        const label = result.container.querySelector('.form__label')
        const input = result.container.querySelector('#input')
        expect(label).toBeTruthy()
        expect(input).toBeTruthy()
    })

    it('Other Options', async () => {
        const Component = () => (
            <Input required label="label" errorMessage="errorMessage" />
        )
        const result = render(<Component />)
        const label = result.container.querySelector('.form__label')
        const required = result.container.querySelector(
            '.form__label--required',
        )
        expect(label).toBeTruthy()
        expect(required).toBeTruthy()
    })
})
