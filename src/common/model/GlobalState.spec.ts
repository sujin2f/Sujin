/**
 * @jest-environment jsdom
 */
// yarn test GlobalState.spec.ts

import '@testing-library/jest-dom'
import { GlobalState } from './GlobalState'

describe('GlobalState.ts', () => {
    it('Execution', () => {
        const counter = GlobalState.getInstance('counter', 0)
        const stateChange1 = jest.fn()
        const stateChange2 = jest.fn()
        counter.subscribe(stateChange1)
        counter.subscribe(stateChange2)

        counter.value = 1

        expect(stateChange1).toHaveBeenCalled()
        expect(stateChange2).toHaveBeenCalled()

        GlobalState.destroy('counter')
    })

    it('Separated by multiton', () => {
        const counter1 = GlobalState.getInstance('counter1', 0)
        const counter2 = GlobalState.getInstance('counter2', 0)
        const stateChange1 = jest.fn()
        const stateChange2 = jest.fn()
        counter1.subscribe(stateChange1)
        counter2.subscribe(stateChange2)

        counter1.value = 1

        expect(stateChange1).toHaveBeenCalled()
        expect(stateChange2).not.toHaveBeenCalled()
        expect(counter1.value).toBe(1)
        expect(counter2.value).toBe(0)

        GlobalState.destroy('counter1')
        GlobalState.destroy('counter2')
    })

    it('Unsubscribe', () => {
        const counter = GlobalState.getInstance('counter', 0)
        const stateChange1 = jest.fn()
        const stateChange2 = jest.fn()
        counter.subscribe(stateChange1)
        counter.subscribe(stateChange2)
        counter.unsubscribe(stateChange2)

        counter.value = 1

        expect(stateChange1).toHaveBeenCalled()
        expect(stateChange2).not.toHaveBeenCalled()

        GlobalState.destroy('counter')
    })
})
