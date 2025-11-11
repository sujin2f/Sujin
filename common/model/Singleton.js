"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Singleton = void 0;
const Singleton = () => {
    return class {
        static _instance;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        constructor(...args) { }
        static getInstance(...args) {
            if (!this._instance) {
                this._instance = new this(...args);
            }
            return this._instance;
        }
    };
};
exports.Singleton = Singleton;
