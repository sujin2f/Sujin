// import { isEmpty } from '../utils/object'
// import Logger from './Logger'

/**
 * Abstract base error class with support for additional messages and metadata.
 */
export abstract class A_Error extends Error {
    public messages: unknown[] = []
    public message: string = ''
    public metadata: unknown

    /**
     * Creates an instance of A_Error.
     * @param {string} [message] The error message.
     * @param {...unknown[]} messages Additional error messages.
     */
    constructor(message?: string, ...messages: unknown[]) {
        super(message)
        if (messages) this.messages = messages
    }

    /**
     * Sets the cause of the error.
     * @param {unknown} cause The underlying cause.
     * @returns {A_Error} This error instance for chaining.
     */
    public setCause(cause: unknown) {
        this.cause = cause
        return this
    }

    /**
     * Sets metadata associated with the error.
     * @param {unknown} metadata The metadata.
     * @returns {A_Error} This error instance for chaining.
     */
    public setMetadata(metadata: unknown) {
        this.metadata = metadata
        return this
    }

    /**
     * Logs the error and its cause chain.
     * @returns {A_Error} This error instance for chaining.
     */
    public log() {
        // const message = this.stack || this.message
        // const messages = this.messages
        //     .map((data) => {
        //         if (
        //             (typeof data === 'object' || Array.isArray(data)) &&
        //             !isEmpty(data)
        //         )
        //             return JSON.stringify(data)
        //         return data
        //     })
        //     .filter((v) => v)

        // if (messages.length) {
        //     Logger.server(`🤬 ${message}`, messages)
        // } else {
        //     Logger.server(`🤬 ${message}`)
        // }

        if (this.cause) {
            if (this.cause instanceof A_Error) {
                this.cause.log()
            } else if (this.cause instanceof Error) {
                // Logger.server(this.cause.message)
            }
        }
        return this
    }
}

export class IOError extends A_Error {
    name = 'IO Error'
}
export class InternalError extends A_Error {
    name = 'Internal Error'
}
export class NodeModuleError extends InternalError {
    name = 'NodeModule Error'
}
export class EnvironmentError extends InternalError {
    name = 'Environment Error'
}
export class DatabaseError extends InternalError {
    name = 'Database Error'
}
export class NoContentError extends DatabaseError {
    name = '204 No Content'
}
export class FetchError extends A_Error {
    name = 'Fetch Error'
}
export class UnauthorizedError extends A_Error {
    name = '401 Unauthorized'
    message = 'You are not authorized to access here.'
}
export class ForbiddenError extends A_Error {
    name = '403 Forbidden'
}
