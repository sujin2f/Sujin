import winston from 'winston'
const { combine, timestamp, printf, colorize, align } = winston.format

const logger = winston.createLogger({
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
    // TODO production setting https://github.com/sujin2f/Sujin/issues/178
})

/* eslint-disable @typescript-eslint/no-explicit-any */
const join = (prefix: string, message: any[]) => [prefix, ...message].map((item) => item && item.toString()).join(' ')

/**
 * Winston logger instance used across the application.
 *
 * - The logger uses the `LOG_LEVEL` env var (defaults to `info`).
 * - Outputs to the console with timestamps and colored levels.
 *
 * Usage:
 * ```ts
 * import Logger from '@src/utils/logger'
 * Logger.info('Server started')
 * ```
 */
export const Logger = {
    info: (...message: any[]) => {
        logger.info(join('👀', message))
    },
    error: (...message: any[]) => {
        logger.error(join('🤬', message))
    },
    warn: (...message: any[]) => {
        logger.warn(join('⚠️', message))
    },
    log: (...message: any[]) => {
        logger.info(join('⭐️', message))
    },
}
