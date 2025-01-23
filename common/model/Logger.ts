const styleLog = [
    'background: #fdd663',
    'color: black',
    'padding: 3px 4px',
    'border-radius: 3px',
].join(';')

export const logger = (message: string | number | boolean) => {
    return [`%cLOG%c ${message}`, styleLog, []]
}
