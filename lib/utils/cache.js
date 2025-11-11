"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cachedRequest = exports.getCacheKey = void 0;
/* Models */
const Cached_1 = __importDefault(require("@common/model/Cached"));
/* CONSTANTS */
const helper_1 = require("@common/constants/helper");
const datetime_1 = require("@common/constants/datetime");
const helper_2 = require("@common/constants/helper");
/**
 *
 * @param {COLLECTION} collection
 * @param {(string | number | undefined)[]} suffixes
 * @returns {string}
 */
const getCacheKey = (collection, ...suffixes) => [helper_2.VERSION, collection, ...suffixes].filter((v) => v).join('-');
exports.getCacheKey = getCacheKey;
/**
 * @param {COLLECTION} collection
 * @param {(string | number | undefined)[]} keys
 * @param {() => Promise<T>} callback
 * @param {number} ttl
 * @param {boolean} force
 * @returns {Promise<T>}
 * @throws {NoContentError}
 */
const cachedRequest = (callback, cacheKey, option = {
    ttl: datetime_1.DAY_IN_SECONDS,
    force: helper_1.IS_DEV,
}) => {
    return async (...args) => await Cached_1.default.getInstance().getOrExecute(cacheKey, callback(...args), option);
};
exports.cachedRequest = cachedRequest;
