/**
 * @jest-environment jsdom
 */
// yarn test Select.spec.ts

import '@testing-library/jest-dom'
import React, { Fragment, useState } from 'react'
import { render, act, screen, fireEvent } from '@testing-library/react'
import Select from './Select'

describe('Select.ts', () => {
    const options = {
        '': 'Please Select',
        option1: 'Value 1',
        option2: 'Value 2',
    }

    test('Basic', async () => {
        const Component = () => <Select options={options} id="select" />
        const result = render(<Component />)
        const option = result.getAllByRole('option').map((el) => el.textContent)
        expect(option).toStrictEqual(['Please Select', 'Value 1', 'Value 2'])
    })

    test('Option Group', async () => {
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
        const Component = () => <Select options={optionsGroup} id="select" />
        const result = render(<Component />)
        const option = result.getAllByRole('option').map((el) => el.textContent)
        expect(option).toStrictEqual([
            'Please Select',
            'Z3',
            'Z4',
            'For Two',
            'For Four',
        ])
        const optgroup = result.container.querySelectorAll('optgroup')
        expect(optgroup.length).toBe(2)
        expect(optgroup.item(0).getAttribute('label')).toBe('BMW')
        expect(optgroup.item(1).getAttribute('label')).toBe('Smart')
    })

    test('With props', async () => {
        const Component = () => (
            <Select
                options={options}
                id="select"
                defaultValue="option1"
                label="Label"
                disabled
                required
                helpText="helpText"
                errorMessage="errorMessage"
            />
        )
        const result = render(<Component />)

        const select = result.getByLabelText('Label')
        const paragraph = result
            .getAllByRole('paragraph')
            .map((item) => item.outerHTML)

        expect(select.getAttribute('aria-describedby')).toBe('select-help-text')
        expect(select.getAttribute('class')).toBe('form__input')
        expect(paragraph).toStrictEqual([
            '<p class="form__input__error-message">errorMessage</p>',
            '<p class="form__input__help-text" id="select-help-text">helpText</p>',
        ])
    })

    test('OnChange', async () => {
        const Component = () => {
            const [selected, ChangeSelected] = useState('')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const onChange = (e: any) => {
                ChangeSelected(e.target.value)
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
