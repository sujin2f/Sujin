import {
    isMobile as isMobileDom,
    scrollTo as scrollToDom,
    debounce as debounceDom,
    copyText as copyTextDom,
} from './dom'

/**
 * Checks if the browser is a mobile device.
 * @deprecated Moved to dom.ts - use isMobile from dom instead.
 */
export const isMobile = isMobileDom

/**
 * Scrolls to the specified element or to the top of the page.
 * @deprecated Moved to dom.ts - use scrollTo from dom instead.
 */
export const scrollTo = scrollToDom

/**
 * Delays execution of a callback function.
 * @deprecated Moved to dom.ts - use debounce from dom instead.
 */
export const debounce = debounceDom

/**
 * Copies text to the system clipboard.
 * @deprecated Moved to dom.ts - use copyText from dom instead.
 */
export const copyText = copyTextDom
