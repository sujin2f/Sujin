/**
 * @jest-environment jsdom
 */
// yarn test src/client/components/form/Switch.spec.ts

import '@testing-library/jest-dom'
import React, { Fragment, useState } from 'react'
import { render, fireEvent, act, screen } from '@testing-library/react'
import { Switch } from './Switch'

describe('Switch.ts', () => {
    it('Basic', async () => {
        const Component = (): JSX.Element => <Switch id="switch" />
        const result = render(<Component />)

        const switchInput = result.container.querySelector('#switch')
        const switchPaddle = result.container.querySelector('.switch-paddle')

        expect(switchInput).toBeTruthy()
        expect(switchPaddle).toBeTruthy()
    })

    it('onChange', async () => {
        const Component = (): JSX.Element => {
            const [checked, ChangeChecked] = useState(false)
            const onChange = (value: boolean) => {
                ChangeChecked(value)
            }
            return (
                <Fragment>
                    <Switch id="switch" onChange={onChange} checked={checked} />
                    <div data-testid="checked">
                        {checked ? 'true' : 'false'}
                    </div>
                </Fragment>
            )
        }
        const result = render(<Component />)
        const switchInput = result.container.querySelector('#switch')
        const isChecked = screen.getByTestId('checked')
        expect(isChecked).toHaveTextContent('false')

        fireEvent.click(switchInput!)
        await act(
            async () => await new Promise((resolve) => setTimeout(resolve, 10)),
        )
        expect(isChecked).toHaveTextContent('true')
    })
})
