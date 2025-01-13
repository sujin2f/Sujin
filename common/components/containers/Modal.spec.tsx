/**
 * @jest-environment jsdom
 */
// yarn test Modal.spec.ts

import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import { Modal } from './Modal'

const mockUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockUsedNavigate,
}))

describe('Modal.ts', () => {
    it('Base', async () => {
        const Component = () => {
            return <Modal />
        }
        const result = render(<Component />)
        const reveal = result.container.querySelector('.reveal')
        expect(reveal).toBeTruthy()
    })
})
