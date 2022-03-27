/**
 * @jest-environment jsdom
 */
// yarn test src/client/components/form/Datalist.spec.ts

import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import { Datalist } from './Datalist'

describe('Datalist.ts', () => {
    it('Basic', async () => {
        const Component = (): JSX.Element => (
            <Datalist values={['Value 1', 'Value 2']} id="datalist" />
        )
        render(<Component />)
        expect(document.body.innerHTML).toMatch(
            '<div><datalist id="datalist"><option value="Value 1"></option><option value="Value 2"></option></datalist></div>',
        )
    })
})
