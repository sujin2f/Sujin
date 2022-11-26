/**
 * @jest-environment jsdom
 */
// yarn test Row.spec.ts

import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import { Row } from './Row'

describe('Row.ts', () => {
    it('Basic', async () => {
        const Component = (): JSX.Element => (
            <Row className="className" dom="section" />
        )
        const result = render(<Component />)

        const row = result.container.querySelector('section.row.className')
        expect(row).toBeTruthy()
    })
})
