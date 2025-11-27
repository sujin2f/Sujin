const { TextEncoder, TextDecoder } = require('util')

// import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
