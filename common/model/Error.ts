import Logger from './Logger'

export abstract class A_Error extends Error {
    constructor(message: string, ...data: unknown[]) {
        super(message)
        Logger.server(
            `🤬 ${message}`,
            ...data.map((data) => {
                if (typeof data === 'object' || Array.isArray(data))
                    return JSON.stringify(data)
                return data
            }),
        )
    }

    public options(cause: unknown) {
        this.cause = cause
        return this
    }
}

export class IOError extends A_Error {}
export class InternalError extends A_Error {}
export class NodeModuleError extends InternalError {}
export class EnvironmentError extends InternalError {}
export class DatabaseError extends InternalError {}
export class FetchError extends A_Error {}
export class PermissionError extends A_Error {}
