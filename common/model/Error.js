"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenError = exports.UnauthorizedError = exports.FetchError = exports.NoContentError = exports.DatabaseError = exports.EnvironmentError = exports.NodeModuleError = exports.InternalError = exports.IOError = exports.A_Error = void 0;
const object_1 = require("../utils/object");
const Logger_1 = __importDefault(require("./Logger"));
class A_Error extends Error {
    messages = [];
    message = '';
    metadata;
    constructor(message, ...messages) {
        super(message);
        if (messages)
            this.messages = messages;
    }
    setCause(cause) {
        this.cause = cause;
        return this;
    }
    setMetadata(metadata) {
        this.metadata = metadata;
        return this;
    }
    log() {
        const message = this.stack || this.message;
        const messages = this.messages
            .map((data) => {
            if ((typeof data === 'object' || Array.isArray(data)) &&
                !(0, object_1.isEmpty)(data))
                return JSON.stringify(data);
            return data;
        })
            .filter((v) => v);
        if (messages.length) {
            Logger_1.default.server(`🤬 ${message}`, messages);
        }
        else {
            Logger_1.default.server(`🤬 ${message}`);
        }
        if (this.cause) {
            if (this.cause instanceof A_Error) {
                this.cause.log();
            }
            else if (this.cause instanceof Error) {
                Logger_1.default.server(this.cause.message);
            }
        }
        return this;
    }
}
exports.A_Error = A_Error;
class IOError extends A_Error {
    name = 'IO Error';
}
exports.IOError = IOError;
class InternalError extends A_Error {
    name = 'Internal Error';
}
exports.InternalError = InternalError;
class NodeModuleError extends InternalError {
    name = 'NodeModule Error';
}
exports.NodeModuleError = NodeModuleError;
class EnvironmentError extends InternalError {
    name = 'Environment Error';
}
exports.EnvironmentError = EnvironmentError;
class DatabaseError extends InternalError {
    name = 'Database Error';
}
exports.DatabaseError = DatabaseError;
class NoContentError extends DatabaseError {
    name = '204 No Content';
}
exports.NoContentError = NoContentError;
class FetchError extends A_Error {
    name = 'Fetch Error';
}
exports.FetchError = FetchError;
class UnauthorizedError extends A_Error {
    name = '401 Unauthorized';
    message = 'You are not authorized to access here.';
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends A_Error {
    name = '403 Forbidden';
}
exports.ForbiddenError = ForbiddenError;
