/**
 * @jest-environment jsdom
 */
// yarn test Button.spec.ts

import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import Button from './Button'

describe('Button.ts', () => {
    it('Basic', async () => {
        const Component = () => <Button title="Submit" />
        const result = render(<Component />)
        expect(result.container.innerHTML).toMatch(
            '<button class="button button--primary" aria-label="Submit">Submit</button>',
        )
    })
})
