const styleLog = [
    'background: #fdd663',
    'color: black',
    'padding: 3px 4px',
    'border-radius: 3px',
].join(';')

export class Logger {
    static client(message: string) {
        console.log([`%cLOG%c ${message}`, styleLog, []])
    }

    static server(message: string) {
        const date = new Date()
        const result = `${date.toLocaleDateString()} ${date.toLocaleTimeString()} - ${message}`
        console.log(result)
    }
}
