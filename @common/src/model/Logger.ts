// TODO use winston
import { IS_DEV, IS_TEST } from '../constants/helper'

const styleLog = ['background: #fdd663', 'color: black', 'padding: 3px 4px', 'border-radius: 3px'].join(';')

/**
 * Internal logging function with styled output.
 * @param {string} message The message to log.
 * @private
 */
const log = (message: string) => {
    // eslint-disable-next-line no-console
    console.log(`%cLOG%c ${message}`, styleLog, [])
}

/**
 * Logger utility class for client and server-side logging.
 */
export default class Logger {
    /**
     * Logs a message to the client console (not in test mode).
     * @param {string} message The message to log.
     */
    static client(message: string) {
        if (!IS_TEST) {
            log(message)
        }
    }

    /**
     * Logs a message only in development mode.
     * @param {string} message The message to log.
     */
    static dev(message: string) {
        if (IS_DEV) {
            log(message)
        }
    }

    /**
     * Logs a server-side message with timestamp (not in test mode).
     * @param {...unknown[]} message The message(s) to log.
     */
    static server(...message: unknown[]) {
        if (!IS_TEST) {
            const date = new Date()
            const result = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
            // eslint-disable-next-line no-console
            console.log(result, ...message)
        }
    }
}
