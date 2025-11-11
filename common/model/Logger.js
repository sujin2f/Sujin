"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("@common/constants/helper");
const styleLog = [
    'background: #fdd663',
    'color: black',
    'padding: 3px 4px',
    'border-radius: 3px',
].join(';');
const log = (message) => {
    console.log(`%cLOG%c ${message}`, styleLog, []);
};
class Logger {
    static client(message) {
        if (!helper_1.IS_TEST) {
            log(message);
        }
    }
    static dev(message) {
        if (helper_1.IS_DEV) {
            log(message);
        }
    }
    static server(...message) {
        if (!helper_1.IS_TEST) {
            const date = new Date();
            const result = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
            console.log(result, ...message);
        }
    }
}
exports.default = Logger;
