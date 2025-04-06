import { IS_DEV, IS_TEST } from '@common/constants/helper'

const styleLog = [
    'background: #fdd663',
    'color: black',
    'padding: 3px 4px',
    'border-radius: 3px',
].join(';')

const log = (message: string) => {
    console.log(`%cLOG%c ${message}`, styleLog, [])
}

export default class Logger {
    static client(message: string) {
        if (!IS_TEST) {
            log(message)
        }
    }

    static dev(message: string) {
        if (IS_DEV) {
            log(message)
        }
    }

    static server(...message: unknown[]) {
        if (!IS_TEST) {
            const date = new Date()
            const result = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
            console.log(result, ...message)
        }
    }
}
