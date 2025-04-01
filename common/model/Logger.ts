import { IS_TEST } from '@common/constants/helper'

const styleLog = [
    'background: #fdd663',
    'color: black',
    'padding: 3px 4px',
    'border-radius: 3px',
].join(';')

export default class Logger {
    static client(message: string) {
        console.log([`%cLOG%c ${message}`, styleLog, []])
    }

    static server(message: string) {
        if (IS_TEST) {
            return
        }
        const date = new Date()
        const result = `${date.toLocaleDateString()} ${date.toLocaleTimeString()} - ${message}`
        console.log(result)
    }
}
