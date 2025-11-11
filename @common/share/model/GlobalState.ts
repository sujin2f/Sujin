import type { Fn } from '../types'
import { Multiton } from './Multiton'

export class GlobalState<T> extends Multiton<GlobalState<unknown>>() {
    private _subscribers: Fn<[T]>[] = []

    // Initial Value
    protected constructor(protected _value: T) {
        super()
    }

    public get value() {
        return this._value
    }

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

    public subscribe(render: Fn<[T]>) {
        // This is a function for subscribing to a global state
        if (this._subscribers.indexOf(render) > -1) {
            // Already subscribed
            return
        }
        // Subscribe a component
        this._subscribers.push(render)
    }

    public unsubscribe(render: Fn<[T]>) {
        // This is a function for unsubscribing from a global state
        this._subscribers = this._subscribers.filter(
            (subscriber) => subscriber !== render,
        )
    }
}
