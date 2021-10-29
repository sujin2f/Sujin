/**
 * Datetime Constants
 *
 * @module constants
 * @todo Are they used?
 */

const second = 1000
const minute = second * 60
const hour = minute * 60
const day = hour * 24
const week = day * 7

export enum MiliSeconds {
    SECOND = second,
    MINUTE = minute,
    HOUR = hour,
    DAY = day,
    WEEK = week,
}

const minuteInSeconds = 60
const hourInSeconds = minuteInSeconds * 60
const dayInSeconds = hourInSeconds * 24

export enum Seconds {
    MINUTE = minuteInSeconds,
    HOUR = hourInSeconds,
    DAY = dayInSeconds,
}
