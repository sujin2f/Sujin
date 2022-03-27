/**
 * @jest-environment jsdom
 */
// yarn test src/client/components/form/Input.spec.ts

import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import { Input } from './Input'

describe('Input.ts', () => {
    it('Basic', async () => {
        const Component = (): JSX.Element => <Input id="input" />
        const result = render(<Component />)
        expect(result.container.innerHTML).toMatch(
            '<input id="input" type="text" class=" ">',
        )
    })
})
