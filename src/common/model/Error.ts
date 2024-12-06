interface ErrorOptions2 extends ErrorOptions {
    code?: string
    source?: string
    level?: 'info' | 'log' | 'warn' | 'error'
}

class MyError extends Error {
    public code?: string
    public source?: string
    public level?: 'info' | 'log' | 'warn' | 'error'

    constructor(message?: string, options?: ErrorOptions2) {
        const _options = {
            cause: options?.cause,
        }
        super(message, _options)
        this.code = options?.code
        this.source = options?.source
        this.level = options?.level

        if (this.level) {
            const msg = `${this.code ? `[${this.code}]: ` : ''}${
                message ? message : ''
            }${this.source ? ` @ ${this.source}` : ''}`

            switch (this.level) {
                case 'info':
                    console.info(msg)
                    break
                case 'log':
                    console.log(msg)
                    break
                case 'warn':
                    console.warn(msg)
                    break
                case 'error':
                    console.error(msg)
                    break
            }
        }
    }
}
export { MyError as Error }
