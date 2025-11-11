"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEmptyParagraphs = exports.phpUnSerialize = exports.removeURLProtocol = exports.joinClassNames = exports.capitalize = exports.generateUUID = exports.toNumber = void 0;
const Error_1 = require("../model/Error");
const types_1 = require("../types");
/**
 * String to number
 * i.g $1, 123, 00.23
 */
const toNumber = (input) => {
    if (!input) {
        return 0;
    }
    const float = parseFloat(input.replace(/[^0-9.-]+/g, ''));
    if (!float || isNaN(float)) {
        return 0;
    }
    return float;
};
exports.toNumber = toNumber;
/**
 * Generates a UUID.
 *
 * @returns {string} The generated UUID.
 */
const generateUUID = () => {
    let d = new Date().getTime();
    let d2;
    try {
        d2 = performance && performance.now && performance.now() * 1000;
    }
    catch {
        d2 = 0;
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16;
        if (d > 0) {
            // tslint:disable-next-line: no-bitwise
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        }
        else {
            // tslint:disable-next-line: no-bitwise
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        // tslint:disable-next-line: no-bitwise
        return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16);
    });
};
exports.generateUUID = generateUUID;
/**
 * Capitalizes the first letter of the input string.
 *
 * @param {string} input - The input string.
 * @returns {string} The capitalized string.
 */
const capitalize = (input) => `${input.charAt(0).toUpperCase()}${input.slice(1)}`;
exports.capitalize = capitalize;
/**
 * Joins multiple inputs into a single class name string.
 *
 * @param {...unknown[]} input - The input values.
 * @returns {string} The concatenated class name string.
 */
const joinClassNames = (...input) => input
    .filter((s) => s)
    .map((s) => s.toString().trim())
    .join(' ');
exports.joinClassNames = joinClassNames;
/**
 * Removes the protocol from a URL.
 *
 * @param {string} url - The input URL.
 * @returns {string} The URL without the protocol.
 */
const removeURLProtocol = (url) => url.replace(/(^\w+:|^)\/\//, '//');
exports.removeURLProtocol = removeURLProtocol;
/**
 * Simple version of PHP un-serializer just for attachment meta values
 * Needs production testing before it's fully replaced
 * @todo for array
 */
const phpUnSerialize = (input) => {
    const readBlock = (input) => {
        if (!input) {
            return false;
        }
        if (input.startsWith('{}')) {
            return '{}';
        }
        if (input.startsWith('{')) {
            return '{';
        }
        if (input.startsWith('}')) {
            return '}';
        }
        if (input.startsWith('a:{')) {
            return 'a:{';
        }
        if (input.startsWith('a')) {
            return 'a';
        }
        const matched = input.match(/^s:[0-9]+:(.*?);/) || input.match(/^[ibd]:([0-9]+);/);
        if (!matched) {
            return false;
        }
        return matched;
    };
    // First, convert all between quotes
    const regexQuote = new RegExp(/"(.*?)"/g);
    const replaceQuote = '$%quote%$';
    const quotes = input.matchAll(regexQuote);
    let converted = input.trim().replaceAll(regexQuote, replaceQuote);
    let result = '';
    // Remove first array identifier
    converted = converted.replace(/^a:[0-9]+:/, '');
    let cursor = types_1.QuantumBool.TRUE;
    while (cursor !== types_1.QuantumBool.MOD) {
        const block = readBlock(converted);
        switch (block) {
            case '{}':
                result += ':{},';
                converted = converted.slice(2);
                cursor = types_1.QuantumBool.TRUE;
                break;
            case '{':
                result += ':{';
                converted = converted.slice(1);
                cursor = types_1.QuantumBool.TRUE;
                break;
            case '}':
                result = result.slice(0, -1);
                result += '},';
                converted = converted.slice(1);
                cursor = types_1.QuantumBool.TRUE;
                break;
            case 'a':
                const matchA = converted.match(/^a:[0-9]+:/);
                if (matchA) {
                    converted = converted.replace(matchA[0], '');
                }
                break;
            case 'a:{':
                converted = converted.replace('a:', '');
                break;
            default:
                if (Array.isArray(block)) {
                    converted = converted.replace(block[0], '');
                    if (cursor === types_1.QuantumBool.TRUE) {
                        result += block[1];
                        cursor = types_1.QuantumBool.FALSE;
                    }
                    else if (cursor === types_1.QuantumBool.FALSE) {
                        result += `:${block[1]},`;
                        cursor = types_1.QuantumBool.TRUE;
                    }
                }
                else {
                    cursor = types_1.QuantumBool.MOD;
                }
        }
    }
    if (result.startsWith(':')) {
        result = result.slice(1);
    }
    if (result.endsWith(',')) {
        result = result.slice(0, -1);
    }
    // Convert %quote% back to string
    Array.from(quotes).forEach((quote) => {
        result = result.replace(replaceQuote, quote[0]);
    });
    try {
        return JSON.parse(result);
    }
    catch {
        throw new Error_1.IOError(result).setCause(exports.phpUnSerialize);
    }
};
exports.phpUnSerialize = phpUnSerialize;
const removeEmptyParagraphs = (value) => {
    return value
        .replace(/<p>$/, '')
        .replace(/^<\/p>/, '')
        .replace('/n', '')
        .trim();
};
exports.removeEmptyParagraphs = removeEmptyParagraphs;
