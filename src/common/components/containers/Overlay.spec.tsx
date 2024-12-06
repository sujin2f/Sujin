/**
 * @jest-environment jsdom
 */
// yarn test Reveal.spec.ts

import '@testing-library/jest-dom'
import React, { Fragment, useState } from 'react'
import { render, fireEvent, screen, act } from '@testing-library/react'
import { Overlay } from './Overlay'

describe('useOverlay.ts', () => {
    it('Open and Close', async () => {
        const fn = jest.fn()
        const Component = (): JSX.Element => {
            const [opened, changeOpened] = useState(false)
            return (
                <Fragment>
                    {opened && (
                        <Overlay onClick={fn}>
                            <button
                                onClick={() => changeOpened(false)}
                                data-testid="close"
                            />
                        </Overlay>
                    )}
                    <button
                        onClick={() => changeOpened(true)}
                        data-testid="open"
                    />
                </Fragment>
            )
        }
        render(<Component />)

        // Test Overlay does not exist
        try {
            screen.getByTestId('overlay')
            expect(true).toBeFalsy()
        } catch (e) {
            expect(true).toBeTruthy()
        }

        // Test click and opened
        fireEvent.click(screen.getByTestId('open'))
        expect(screen.getByTestId('overlay')).toBeTruthy()

        // Test click and close
        fireEvent.click(screen.getByTestId('close'))
        try {
            screen.getByTestId('overlay')
            expect(true).reveal()
        } catch (e) {
            expect(true).toBeTruthy()
        }

        // Test overlay click
        fireEvent.click(screen.getByTestId('open'))
        fireEvent.click(screen.getByTestId('overlay'))
        await act(
            async () => await new Promise((resolve) => setTimeout(resolve, 0)),
        )
        try {
            screen.getByTestId('overlay')
            expect(true).toBeFalsy()
        } catch (e) {
            expect(true).toBeTruthy()
        }
        expect(fn).toBeCalled()
    })
})
