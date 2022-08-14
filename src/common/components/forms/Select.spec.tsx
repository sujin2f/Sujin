/**
 * @jest-environment jsdom
 */
// yarn test Select.spec.ts

import '@testing-library/jest-dom'
import React, { Fragment, useState } from 'react'
import { render, act, screen, fireEvent } from '@testing-library/react'
import { Select } from './Select'

describe('Select.ts', () => {
    const options = {
        '': 'Please Select',
        option1: 'Value 1',
        option2: 'Value 2',
    }

    it('Basic', async () => {
        const Component = (): JSX.Element => (
            <Select options={options} id="select" />
        )
        const result = render(<Component />)
        expect(result.container.innerHTML).toMatch(
            '<select id="select" aria-describedby=""><option value="">Please Select</option><option value="option1">Value 1</option><option value="option2">Value 2</option></select>',
        )
    })

    it('Option Group', async () => {
        const optionsGroup = {
            '': 'Please Select',
            BMW: {
                z3: 'Z3',
                z4: 'Z4',
            },
            Smart: {
                forTwo: 'For Two',
                forFour: 'For Four',
            },
        }
        const Component = (): JSX.Element => (
            <Select options={optionsGroup} id="select" />
        )
        const result = render(<Component />)
        expect(result.container.innerHTML).toMatch(
            '<select id="select" aria-describedby=""><option value="">Please Select</option><optgroup label="BMW"><option value="z3">Z3</option><option value="z4">Z4</option></optgroup><optgroup label="Smart"><option value="forTwo">For Two</option><option value="forFour">For Four</option></optgroup></select>',
        )
    })

    it('With props', async () => {
        const Component = (): JSX.Element => (
            <Select
                options={options}
                id="select"
                defaultValue="option1"
                label="Label"
                autoFocus
                disabled
                required
                helpText="helpText"
            />
        )
        const result = render(<Component />)
        expect(result.container.innerHTML).toMatch(
            '<label for="select" class="form-label form-label--required">Label</label><select id="select" disabled="" required="" aria-describedby="select-help-text"><option value="">Please Select</option><option value="option1" selected="">Value 1</option><option value="option2">Value 2</option></select><p class="help-text" id="select-help-text">helpText</p>',
        )
    })

    it('OnChange', async () => {
        const Component = (): JSX.Element => {
            const [selected, ChangeSelected] = useState('')
            const onChange = (value: string) => {
                ChangeSelected(value)
            }
            return (
                <Fragment>
                    <Select options={options} onChange={onChange} id="select" />
                    <div data-testid="selected">{selected}</div>
                </Fragment>
            )
        }
        const result = render(<Component />)
        const select = result.container.querySelector('#select')
        fireEvent.change(select!, { target: { value: 'option1' } })

        await act(
            async () => await new Promise((resolve) => setTimeout(resolve, 0)),
        )
        expect(screen.getByTestId('selected')).toHaveTextContent('option1')
    })
})
