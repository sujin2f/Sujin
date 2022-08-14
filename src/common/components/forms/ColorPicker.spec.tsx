/**
 * @jest-environment jsdom
 */
// yarn test src/client/components/form/ColorPicker.spec.ts

import '@testing-library/jest-dom'
import React from 'react'
import { render, act, fireEvent } from '@testing-library/react'
import { ColorPicker } from './ColorPicker'

describe('ColorPicker.ts', () => {
    it('Basic', async () => {
        const Component = (): JSX.Element => <ColorPicker />
        const result = render(<Component />)
        expect(result.container.innerHTML).toMatch(
            '<div class="color-picker"><input type="hidden" value=""><div class="color-picker__label"></div><div class="color-picker__swatch"></div></div>',
        )
    })

    it('Props and Pops', async () => {
        const Component = (): JSX.Element => (
            <ColorPicker color="#123456" label="Label" />
        )
        const result = render(<Component />)
        expect(result.container.innerHTML).toMatch(
            '<div class="color-picker"><input type="hidden" value="#123456"><div class="color-picker__label">Label</div><div class="color-picker__swatch" style="background: rgb(18, 52, 86);"></div></div>',
        )

        let click = result.container.querySelector('.color-picker__label')
        fireEvent.click(click!)

        await act(
            async () => await new Promise((resolve) => setTimeout(resolve, 0)),
        )

        let picker = result.container.querySelector('.swatches-picker')
        expect(picker).toBeTruthy()

        click = result.container.querySelector('.color-picker__swatch')
        fireEvent.click(click!)
        picker = result.container.querySelector('.swatches-picker')
        expect(picker).toBeFalsy()

        fireEvent.click(click!)
        click = result.container.querySelector('.color-picker__cover')
        fireEvent.click(click!)
        picker = result.container.querySelector('.swatches-picker')
        expect(picker).toBeFalsy()
    })
})
