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
            const code = this.code ? `[${this.code}]: ` : ''
            const msg = message ? message : ''
            const source = this.source ? ` @ ${this.source}` : ''
            const date = new Date()
            const result = `${date.toLocaleDateString()} ${date.toLocaleTimeString()} - ${code}${msg}${source}`

            switch (this.level) {
                case 'info':
                    console.info(result)
                    break
                case 'log':
                    console.log(result)
                    break
                case 'warn':
                    console.warn(result)
                    break
                case 'error':
                    console.error(result)
                    break
            }
        }
    }
}
export { MyError as Error }
