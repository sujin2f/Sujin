"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNITS_SELECTION = exports.CONVERT_VOLUMES = exports.CONVERT_WEIGHT = exports.UNITS = exports.UNITS_VOLUMES = exports.UNITS_WEIGHT = void 0;
exports.UNITS_WEIGHT = ['g', 'kg', 'lb'];
exports.UNITS_VOLUMES = ['ml', 'l', 'oz', 'tbsp', 'tsp', 'cup'];
exports.UNITS = [...exports.UNITS_WEIGHT, ...exports.UNITS_VOLUMES, 'ea'];
exports.CONVERT_WEIGHT = {
    g: 1,
    kg: 1000,
    lb: 453.592,
};
exports.CONVERT_VOLUMES = {
    ml: 1,
    l: 1000,
    oz: 29.5735,
    tbsp: 15,
    tsp: 5,
    cup: 236.59,
};
exports.UNITS_SELECTION = {
    weight: exports.UNITS_WEIGHT,
    volume: exports.UNITS_VOLUMES,
    ea: 'ea',
};
