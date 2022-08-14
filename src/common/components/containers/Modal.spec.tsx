/**
 * @jest-environment jsdom
 */
// yarn test Modal.spec.ts

import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import { Modal } from './Modal'

describe('Modal.ts', () => {
    it('Base', async () => {
        const Component = (): JSX.Element => {
            return <Modal />
        }
        const result = render(<Component />)
        const reveal = result.container.querySelector('.reveal')
        expect(reveal).toBeTruthy()
    })
})
