/**
 * @jest-environment jsdom
 */
// yarn test Column.spec.ts

import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import { Column } from './Column'

describe('Column.ts', () => {
    it('Basic', async () => {
        const Component = (): JSX.Element => <Column />
        const result = render(<Component />)

        const columns = result.container.querySelector('.columns')
        expect(columns).toBeTruthy()
    })

    it('Options', async () => {
        const Component = (): JSX.Element => (
            <Column
                small={1}
                smallOffset={1}
                medium={2}
                mediumOffset={2}
                large={3}
                largeOffset={3}
                className="className"
                dom="section"
            />
        )
        const result = render(<Component />)

        const columns = result.container.querySelector(
            'section.columns.small-1.medium-2.large-3.small-offset-1.medium-offset-2.large-offset-3.className',
        )
        expect(columns).toBeTruthy()
    })
})
