import winston from 'winston'
const { combine, timestamp, printf, colorize, align } = winston.format

const Logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        colorize({ all: true }),
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
    ),
    transports: [new winston.transports.Console()],
    // TODO production setting
    //   transports: [
    //     new winston.transports.File({
    //       filename: 'combined.log',
    //     }),
    //     new winston.transports.File({
    //       filename: 'app-error.log',
    //       level: 'error',
    //     }),
})

export default Logger
