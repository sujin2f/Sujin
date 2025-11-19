import 'whatwg-fetch'
import { TextDecoder, TextEncoder } from 'util'

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

global.window.scrollTo = () => {}

const observe = jest.fn()
const unobserve = jest.fn()
const disconnect = jest.fn()
global.window.IntersectionObserver = jest.fn(() => ({
    observe,
    unobserve,
    disconnect,
}))
