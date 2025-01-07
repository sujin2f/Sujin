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
        const Component = () => <CloseButton />
        const result = render(<Component />)
        const closeButton = result.container.querySelector('.button--close')
        expect(closeButton).toBeTruthy()
    })
})
