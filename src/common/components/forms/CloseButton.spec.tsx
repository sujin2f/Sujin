/**
 * @jest-environment jsdom
 */
// yarn test src/common/components/form/CloseButton.spec.ts

import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import { CloseButton } from './CloseButton'

describe('CloseButton.ts', () => {
    it('Basic', async () => {
        const Component = (): JSX.Element => <CloseButton />
        const result = render(<Component />)
        const closeButton = result.container.querySelector('.close-button')
        expect(closeButton).toBeTruthy()
    })
})
