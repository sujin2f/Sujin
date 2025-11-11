"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Singleton_1 = require("./Singleton");
const Error_1 = require("./Error");
/**
 * Node Cache
 */
class Cached extends (0, Singleton_1.Singleton)() {
    async getCache() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cache = global['cache'];
        if (cache) {
            return cache;
        }
        const newCache = await this.init();
        if (!newCache) {
            throw new Error_1.NodeModuleError('NodeCache cannot be set.');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;
        global['cache'] = newCache;
        return newCache;
    }
    constructor() {
        super();
        this.init();
    }
    async init() {
        const NodeCache = (await import('node-cache')).default;
        const cache = new NodeCache();
        global['cache'] = cache;
        return cache;
    }
    async set(key, value, ttl = 0) {
        try {
            const cache = await this.getCache();
            cache.set(key, value, ttl);
        }
        finally {
        }
    }
    async get(key) {
        try {
            const cache = await this.getCache();
            return cache.get(key);
        }
        catch {
            return undefined;
        }
    }
    async getOrExecute(key, callback, option = {
        ttl: 0,
        force: false,
    }) {
        if (option.force) {
            return await callback;
        }
        const get = await this.get(key);
        if (get) {
            return get;
        }
        const result = await callback;
        await this.set(key, result, option.ttl);
        return result;
    }
    async flush(...keys) {
        try {
            const cache = await this.getCache();
            if (keys.length === 0) {
                cache.flushAll();
                return;
            }
            cache.keys().forEach((key) => keys.forEach((del) => {
                if (key.startsWith(del)) {
                    cache.del(key);
                }
            }));
        }
        finally {
        }
    }
    async list() {
        try {
            const cache = await this.getCache();
            return cache.keys();
        }
        catch {
            return [];
        }
    }
}
exports.default = Cached;
