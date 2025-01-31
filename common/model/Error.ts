type ErrorLevel = 'info' | 'log' | 'warn' | 'error'

interface ErrorOptions2 extends ErrorOptions {
    code?: string
    source?: string
    level?: ErrorLevel
}

/**
 * @deprecated Use Logger and global Error
 */
class MyError extends Error {
    public code?: string
    public source?: string
    public level?: ErrorLevel

    constructor(message?: string, options?: ErrorOptions2) {
        const _options = {
            cause: options?.cause,
        }
        super(message, _options)
        this.code = options?.code
        this.source = options?.source
        this.level = options?.level

        if (this.level) {
            this.echo(this.level)
        }
    }

    public echo(level: ErrorLevel) {
        const code = this.code ? `[${this.code}]: ` : ''
        const msg = this.message ? this.message : ''
        const source = this.source ? ` @ ${this.source}` : ''
        const date = new Date()
        const result = `${date.toLocaleDateString()} ${date.toLocaleTimeString()} - ${code}${msg}${source}`

        switch (level) {
            case 'info':
                console.info(result)
                break
            case 'log':
                console.log(result)
                break
            case 'warn':
                console.warn(result)
                break
            default:
                console.error(result)
        }
    }
}
export { MyError as Error }

export const isCustomError = (e: unknown) => e instanceof MyError
