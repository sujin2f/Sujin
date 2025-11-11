"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.select = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const object_1 = require("../utils/object");
const Logger_1 = __importDefault(require("../model/Logger"));
let cached = global.mysql;
if (!cached) {
    cached = global.mysql = { connection: undefined, promise: undefined };
}
const connect = async () => {
    if (cached.connection) {
        return cached.connection;
    }
    if (!cached.promise) {
        cached.promise = promise_1.default.createConnection({
            host: process.env.MYSQL || 'localhost',
            user: process.env.MYSQL_USER || 'MYSQL_USER',
            password: process.env.MYSQL_PASSWORD || 'MYSQL_PASSWORD',
            database: process.env.MYSQL_DB || 'wordpress',
            port: 3306,
        });
    }
    cached.connection = await cached.promise;
    return cached.connection;
};
const select = async (query) => {
    const mysql = await connect().catch((e) => {
        Logger_1.default.server(e.message);
        return undefined;
    });
    if (!mysql) {
        return [];
    }
    const [[result]] = await mysql
        .query(query)
        .then((data) => {
        if ((0, object_1.isEmpty)(data)) {
            return [[[]]];
        }
        return [data];
    })
        .catch(() => {
        return [[[]]];
    });
    return result;
};
exports.select = select;
const update = async (query) => {
    const mysql = await connect().catch((e) => {
        Logger_1.default.server(e.message);
        return undefined;
    });
    if (!mysql) {
        return;
    }
    await mysql.query(query);
};
exports.update = update;
