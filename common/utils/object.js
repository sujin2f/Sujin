"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoStringify = exports.schemaFormatter = exports.entries = exports.keys = exports.omit = exports.mongoIdToString = exports.sort = exports.isEmpty = exports.filterEmpty = void 0;
const Error_1 = require("../model/Error");
/**
 * Remove empty nodes
 */
const filterEmpty = (object) => Object.keys(object)
    .filter((key) => {
    if ((0, exports.isEmpty)(object[key])) {
        return false;
    }
    return object[key];
})
    .reduce((acc, key) => ({ ...acc, [key]: object[key] }), {});
exports.filterEmpty = filterEmpty;
/**
 * Check given value is empty
 * Zero is not empty. Only NaN is empty.
 */
const isEmpty = (value) => {
    if (value === undefined || value === null) {
        return true;
    }
    if (typeof value === 'function') {
        return false;
    }
    if (typeof value === 'boolean') {
        return false;
    }
    if (typeof value === 'string') {
        return value === '';
    }
    if (typeof value === 'number') {
        return isNaN(value);
    }
    if (value instanceof Date) {
        return false;
    }
    if (Array.isArray(value)) {
        return value.filter((v) => !(0, exports.isEmpty)(v)).length === 0;
    }
    // Check if {}
    if (typeof value === 'object') {
        return Object.keys(value).length === 0;
    }
    return !!value;
};
exports.isEmpty = isEmpty;
const sort = (object, func) => Object.entries(object)
    .sort(([aKey, aValue], [bKey, bValue]) => func(aKey, aValue) - func(bKey, bValue))
    .reduce((acc, [key, value]) => ({
    ...acc,
    [key]: value,
}), {});
exports.sort = sort;
/**
 * @deprecated
 */
const mongoIdToString = (...object) => {
    return object.map((item) => ({
        ...item,
        _id: `${item._id}`,
    }));
};
exports.mongoIdToString = mongoIdToString;
const omit = (obj, ...target) => {
    const [key, ...keys] = target;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [key]: _, ...rest } = obj;
    if (keys.length === 0) {
        return rest;
    }
    return (0, exports.omit)(rest, ...keys);
};
exports.omit = omit;
const keys = (object) => {
    return Object.keys(object);
};
exports.keys = keys;
/**
 * Object.entries does not support typing
 * It makes key as string
 *
 * @example
 * type Keys = 'id' | 'title'
 * const data: Record<Keys, string> = {
 *     id: 'string',
 *     title: 'string'
 * }
 * Object.entries(data).map(([key, value]) => {}) // key is string
 * entries(data).map(([key, value]) => {}) // key is 'id' | 'title'
 */
const entries = (object) => {
    return Object.entries(object);
};
exports.entries = entries;
const objectFormatter = (input, schema) => {
    if (!schema.properties) {
        throw new Error_1.IOError('Object schema does not have properties', schema).setCause(objectFormatter);
    }
    const formatted = {};
    const keys = Object.keys(input);
    Object.entries(schema.properties).forEach(([key, value]) => {
        if (keys.includes(key) && !(0, exports.isEmpty)(input[key])) {
            const result = (0, exports.schemaFormatter)(input[key], value);
            if (!(0, exports.isEmpty)(result))
                formatted[key] = result;
        }
    });
    if (schema.required && Array.isArray(schema.required)) {
        schema.required.forEach((key) => {
            if (!Object.keys(formatted).includes(key)) {
                throw new Error_1.IOError(`Required filed ${key} is missing`, schema).setCause(objectFormatter);
            }
        });
    }
    return formatted;
};
const filterEnum = (input, schema) => {
    const enumValues = schema.enum;
    if (enumValues && Array.isArray(enumValues))
        return enumValues.includes(input) ? input : null;
    return input;
};
const schemaFormatter = (input, schema) => {
    switch (schema.bsonType) {
        case 'object':
            if (typeof input === 'object' && !(input instanceof Date))
                return objectFormatter(input, schema);
        case 'array':
            return Array.isArray(input) && Object.keys(schema).includes('items')
                ? input.map((item) => (0, exports.schemaFormatter)(item, schema.items))
                : null;
        case 'int':
            if (typeof input !== 'object' && !Array.isArray(input))
                return typeof input === 'number'
                    ? filterEnum(input, schema)
                    : filterEnum(parseInt(input), schema);
        case 'string':
            return typeof input === 'string' ? filterEnum(input, schema) : null;
        case 'date':
            return input instanceof Date ? input : null;
        case 'bool':
            return typeof input === 'boolean' ? input : null;
        case 'objectId':
            return input;
        default:
            return input;
    }
    return {};
};
exports.schemaFormatter = schemaFormatter;
const mongoStringify = (document, ...excludes) => {
    return Object.entries(document).reduce((acc, [key, value]) => {
        return {
            ...acc,
            [key]: !excludes.includes(key) && value._bsontype
                ? JSON.parse(JSON.stringify(value))
                : value,
        };
    }, {});
};
exports.mongoStringify = mongoStringify;
