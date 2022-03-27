/**
 * @jest-environment jsdom
 */
// yarn test Icon.spec.ts

import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import { Icon } from './Icon'

describe('Icon.ts', () => {
    it('Base', async () => {
        const Component = (): JSX.Element => {
            return <Icon icon="prohibited" />
        }
        const result = render(<Component />)
        const prohibited = result.container.querySelector('.fi-prohibited')
        expect(prohibited).toBeTruthy()
    })
})
