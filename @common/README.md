# Common Share

A comprehensive, sharable utility library for JavaScript and TypeScript applications. This package provides reusable utility functions, design patterns, type definitions, and constants across all types of JavaScript projects.

## Features

-   📦 **Utility Functions**: Array, string, number, object, datetime, and system utilities
-   🏛️ **Design Patterns**: Singleton and Multiton pattern implementations
-   🗂️ **Type-Safe**: Full TypeScript support with strict type checking
-   📝 **Well Documented**: Complete TSDoc comments for all functions and classes
-   ✅ **Fully Tested**: Comprehensive test coverage with Jest
-   🚀 **Production Ready**: Built with ES2022 target and optimized for modern environments

## Table of Contents

-   [Installation](#installation)
-   [Project Structure](#project-structure)
-   [Usage](#usage)
    -   [Utilities](#utilities)
    -   [Design Patterns](#design-patterns)
    -   [Types & Constants](#types--constants)
-   [API Documentation](#api-documentation)
-   [Development](#development)
-   [Testing](#testing)
-   [License](#license)

## Installation

```bash
npm install common-share
```

## Project Structure

```
src/
├── constants/          # Constant values and enumerations
│   ├── asset.ts       # Loading status enumeration
│   ├── datetime.ts    # Time-related constants
│   ├── helper.ts      # Helper constants (env, language list, etc.)
│   └── keycode.ts     # Keyboard key code enumeration
├── model/             # Core classes and design patterns
│   ├── Cache.ts       # Cache management using NodeCache
│   ├── Error.ts       # Custom error classes
│   ├── GlobalState.ts # Global state management
│   ├── Logger.ts      # Logging utility
│   ├── Multiton.ts    # Multiton design pattern
│   └── Singleton.ts   # Singleton design pattern
├── utils/             # Utility functions
│   ├── array.ts       # Array manipulation utilities
│   ├── crypto.ts      # Cryptographic utilities
│   ├── datetime.ts    # Date and time utilities
│   ├── device.ts      # Device detection utilities (deprecated)
│   ├── dom.ts         # DOM and browser utilities
│   ├── enum.ts        # Enumeration utilities
│   ├── logger.ts      # Logger class extension
│   ├── number.ts      # Number formatting and utilities
│   ├── object.ts      # Object manipulation utilities
│   ├── string.ts      # String manipulation utilities
│   └── system.ts      # System utilities
└── types/             # TypeScript type definitions
    └── index.ts       # Custom types (Fn, Nullable, etc.)
```

## Usage

### Utilities

#### Array Utilities

```typescript
import {
    deepCopy,
    splitItems,
    random,
    shuffle,
    transpose,
} from 'common-share/utils/array'

// Deep copy array
const original = [
    [1, 2],
    [3, 4],
]
const copy = deepCopy(original)

// Split array into rows
const items = [1, 2, 3, 4, 5, 6]
const rows = splitItems(items, 2) // [[1, 3, 5], [2, 4, 6]]

// Get random item
const randomItem = random(['a', 'b', 'c'])

// Shuffle array
const shuffled = shuffle([1, 2, 3, 4, 5])

// Transpose matrix
const matrix = [
    [1, 2],
    [3, 4],
]
const transposed = transpose(matrix) // [[1, 3], [2, 4]]
```

#### String Utilities

```typescript
import {
    toNumber,
    generateUUID,
    capitalize,
    joinClassNames,
} from 'common-share/utils/string'

// String to number
const num = toNumber('$123.45') // 123.45

// Generate UUID
const id = generateUUID() // 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'

// Capitalize
const text = capitalize('hello') // 'Hello'

// Join class names
const className = joinClassNames('btn', 'btn-primary', null) // 'btn btn-primary'
```

#### Number Utilities

```typescript
import {
    formatCurrency,
    romanize,
    getRandomInt,
    hexToRgb,
} from 'common-share/utils/number'

// Format as currency
const price = formatCurrency(1234.56, 'USD') // '$1,234.56'

// Convert to Roman numerals
const roman = romanize(42) // 'XLII'

// Random integer
const random = getRandomInt(10) // 0-9
const randomInRange = getRandomInt(20, 10) // 10-19

// Hex to RGB
const rgb = hexToRgb('FF5733') // [255, 87, 51]
```

#### Object Utilities

```typescript
import {
    isEmpty,
    filterEmpty,
    omit,
    entries,
    keys,
} from 'common-share/utils/object'

// Check if value is empty
isEmpty('') // true
isEmpty(0) // false (zero is not empty)
isEmpty(null) // true

// Filter empty values
const obj = { a: 1, b: '', c: null, d: 'hello' }
filterEmpty(obj) // { a: 1, d: 'hello' }

// Omit keys
const user = { id: 1, name: 'John', password: 'secret' }
omit(user, 'password') // { id: 1, name: 'John' }

// Typed entries (preserves key types)
type UserKeys = 'id' | 'name'
const data: Record<UserKeys, string> = { id: '1', name: 'John' }
entries(data) // [['id', '1'], ['name', 'John']]
```

#### DateTime Utilities

```typescript
import { formatDate, addZero, getMonthName } from 'common-share/utils/datetime'

// Format date
const date = new Date('2024-01-15')
formatDate(date) // '2024-01-15'

// Add leading zeros
addZero(5) // '05'
addZero(5, 3) // '005'

// Get month name
getMonthName(date) // 'Jan'
getMonthName(date, true) // 'January'
```

#### DOM Utilities

```typescript
import { isMobile, scrollTo, debounce, copyText } from 'common-share/utils/dom'

// Check if mobile
if (isMobile()) {
    console.log('Mobile device detected')
}

// Scroll to element
scrollTo('#target-section')
scrollTo(null) // Scroll to top

// Debounce function
const debouncedResize = debounce(() => {
    console.log('Window resized')
}, 0.3) // 300ms delay

// Copy to clipboard
copyText('Hello World')
```

#### Crypto Utilities

```typescript
import { createHash } from 'common-share/utils/crypto'

const hash = createHash('password', 'secret')
// Returns MD5 hash of 'passwordsecret'
```

### Design Patterns

#### Singleton Pattern

Ensures only one instance of a class exists throughout the application.

```typescript
import { Singleton } from 'common-share/model/Singleton'

class MyService extends Singleton<MyService>() {
    getData() {
        return 'data'
    }
}

const instance1 = MyService.getInstance()
const instance2 = MyService.getInstance()
console.log(instance1 === instance2) // true
```

#### Multiton Pattern

Allows multiple named instances of a class, one per identifier.

```typescript
import { Multiton } from 'common-share/model/Multiton'

class UserStore extends Multiton<UserStore>() {
    constructor(private userId: string) {
        super()
    }
}

const store1 = UserStore.getInstance('user-1')
const store2 = UserStore.getInstance('user-2')
const store1Again = UserStore.getInstance('user-1')

console.log(store1 === store1Again) // true
console.log(store1 === store2) // false
```

#### Global State Management

Manage application state with observer pattern.

```typescript
import { GlobalState } from 'common-share/model/GlobalState'

class ThemeState extends GlobalState<'light' | 'dark'> {}

const themeState = ThemeState.getInstance('theme')
themeState.value = 'light'

const updateUI = (theme: string) => {
    console.log('Theme changed to:', theme)
}

themeState.subscribe(updateUI)
themeState.value = 'dark' // Notifies all subscribers
themeState.unsubscribe(updateUI)
```

#### Cache Management

Simple in-memory caching with TTL support.

```typescript
import Cached from 'common-share/model/Cache'

const cache = Cached.getInstance()

// Set cache with 1 hour TTL
await cache.set('user-1', { id: 1, name: 'John' }, 3600)

// Get from cache
const user = await cache.get('user-1')

// Get or execute callback
const userData = await cache.getOrExecute('user-2', fetchUserFromAPI(2), {
    ttl: 3600,
})

// Clear cache by prefix
await cache.flush('user-') // Clears all 'user-*' keys

// List all keys
const allKeys = await cache.list()
```

#### Error Handling

Custom error classes with cause chain support.

```typescript
import {
    IOError,
    DatabaseError,
    UnauthorizedError,
} from 'common-share/model/Error'

try {
    // ...
} catch (error) {
    throw new DatabaseError('Failed to fetch user')
        .setCause(error)
        .setMetadata({ userId: 1 })
        .log()
}
```

### Types & Constants

#### Custom Types

```typescript
import { Fn, Nullable, QuantumBool } from 'common-share/types'

// Function type with parameters and return type
const handler: Fn<[string, number], boolean> = (str, num) => true

// Nullable type
const value: Nullable<string> = null

// Quantum Boolean (TRUE, FALSE, MOD)
const state: QuantumBool = QuantumBool.TRUE
```

#### Constants

```typescript
import {
    IS_DEV,
    IS_TEST,
    VERSION,
    nums,
    languages,
} from 'common-share/constants/helper'

import {
    SECOND_IN_MS,
    MINUTE_IN_MS,
    HOUR_IN_MS,
    DAY_IN_MS,
    WEEK_IN_MS,
    ShortMonthNames,
    FullMonthNames,
} from 'common-share/constants/datetime'

import { LoadingStatus } from 'common-share/constants/asset'
import { KeyCodes } from 'common-share/constants/keycode'

if (IS_DEV) {
    console.log('App version:', VERSION)
}

const delay = 5 * MINUTE_IN_MS
const statusLabel = LoadingStatus[LoadingStatus.DONE] // 'DONE'
```

#### Logging

```typescript
import Logger from 'common-share/model/Logger'

Logger.client('User message') // Only logs in browser (not in test)
Logger.dev('Debug info') // Only logs in development
Logger.server('Server log', data) // Logs with timestamp (not in test)
```

## API Documentation

### Utilities

| Module      | Functions                                                                                                              | Purpose                 |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| array.ts    | deepCopy, splitItems, random, trimEnd, trimStart, filterEmpty, map, sum, average, shuffle, getPrev, getNext, transpose | Array manipulation      |
| string.ts   | toNumber, generateUUID, capitalize, joinClassNames, removeURLProtocol, phpUnSerialize, removeEmptyParagraphs           | String processing       |
| number.ts   | formatCurrency, romanize, getRandomInt, hexToRgb                                                                       | Number utilities        |
| object.ts   | filterEmpty, isEmpty, sort, omit, keys, entries                                                                        | Object manipulation     |
| datetime.ts | formatDate, addZero, getMonthName                                                                                      | DateTime handling       |
| dom.ts      | isMobile, scrollTo, debounce, copyText                                                                                 | Browser/DOM utilities   |
| crypto.ts   | createHash                                                                                                             | Cryptographic functions |
| system.ts   | compareVersions                                                                                                        | System utilities        |
| enum.ts     | getEnumKeys, getEnumValues, hasEnumValue, hasEnumKey                                                                   | Enum utilities          |

### Classes

| Class       | Purpose                                |
| ----------- | -------------------------------------- |
| Singleton   | Single instance pattern implementation |
| Multiton    | Multiple named instances pattern       |
| GlobalState | Observable state management            |
| Cached      | In-memory cache with TTL               |
| Logger      | Utility logging                        |
| A_Error     | Base error class                       |

## Development

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

```bash
npm install
```

### Build

```bash
npm run build
```

Compiles TypeScript to JavaScript in the `dist/` directory.

### Testing

```bash
npm test
```

Runs Jest test suite with coverage reporting.

### Linting

```bash
npm run lint
```

Checks code style with ESLint.

### Project Scripts

-   `npm run build` - Compile TypeScript
-   `npm test` - Run tests with coverage
-   `npm run lint` - Run ESLint checks

## Configuration

### TypeScript

-   **Target**: ES2022
-   **Module**: NodeNext
-   **Strict Mode**: Enabled
-   **DOM Support**: Yes

### Jest

-   **Test Environment**: jsdom (for DOM testing)
-   **Coverage**: Enabled by default
-   **Setup Files**: `.jest/setup.jest.js`

## License

ISC - See LICENSE file for details

## Author

Sujin Choi

## Contributing

This is a shared utility library. When adding new utilities:

1. Place functions in appropriate module files
2. Add comprehensive TSDoc comments
3. Add unit tests with good coverage
4. Update this README with examples
5. Ensure all linting passes

---

For more information about specific utilities and their usage, check the JSDoc comments in each source file.
