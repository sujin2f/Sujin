/**
 * @jest-environment jsdom
 */
// yarn test src/client/components/form/Button.spec.ts

import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import { Button } from './Button'

describe('Button.ts', () => {
    it('Basic', async () => {
        const Component = (): JSX.Element => <Button title="Submit" />
        const result = render(<Component />)
        expect(result.container.innerHTML).toMatch(
            '<button class="button primary" aria-label="Submit" type="button">Submit</button>',
        )
    })
})
