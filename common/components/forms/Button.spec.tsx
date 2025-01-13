/**
 * @jest-environment jsdom
 */
// yarn test src/client/components/form/Button.spec.ts

import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import { Button } from './Button'

const mockUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUsedNavigate,
}))

describe('Button.ts', () => {
    it('Basic', async () => {
        const Component = () => <Button title="Submit" />
        const result = render(<Component />)
        expect(result.container.innerHTML).toMatch(
            '<button class="button button--primary" aria-label="Submit" type="button">Submit</button>',
        )
    })
})
