import type { Fn } from '../types'
import { Multiton } from './Multiton'

/**
 * Generic global state management class with observer pattern support.
 * @template T The type of the state value.
 */
export class GlobalState<T> extends Multiton<GlobalState<unknown>>() {
    private _subscribers: Fn<[T]>[] = []

    /**
     * Creates an instance of GlobalState.
     * @param {T} _value The initial state value.
     * @protected
     */
    protected constructor(protected _value: T) {
        super()
    }

    /**
     * Gets the current state value.
     * @returns {T} The current state value.
     */
    public get value() {
        return this._value
    }

    /**
     * Sets the state value and notifies all subscribers.
     * @param {T} newState The new state value.
     */
    public set value(newState: T) {
        if (this._value === newState) {
            return
        }

        this._value = newState // Update global state value

        this._subscribers.forEach((render) => {
            // Notify subscribers that the global state has changed
            render(this._value)
        })
    }

    /**
     * Subscribes to state changes.
     * @param {Fn<[T]>} render The callback to execute when state changes.
     */
    public subscribe(render: Fn<[T]>) {
        // This is a function for subscribing to a global state
        if (this._subscribers.indexOf(render) > -1) {
            // Already subscribed
            return
        }
        // Subscribe a component
        this._subscribers.push(render)
    }

    /**
     * Unsubscribes from state changes.
     * @param {Fn<[T]>} render The callback to remove from subscribers.
     */
    public unsubscribe(render: Fn<[T]>) {
        // This is a function for unsubscribing from a global state
        this._subscribers = this._subscribers.filter(
            (subscriber) => subscriber !== render,
        )
    }
}
