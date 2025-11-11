"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MENU_NAMES = exports.COLLECTION = void 0;
const post_1 = require("@lib/types/post");
/**
 * MongoDB collections
 * @enum
 */
exports.COLLECTION = {
    POST: post_1.POST_TYPE.POST,
    PAGE: post_1.POST_TYPE.PAGE,
    BACKGROUNDS: 'background',
    OPTIONS: 'option',
    SPECTRA: 'spectra',
    USERS: 'user',
    ARCHIVE: 'archive',
    SNIPPET: 'snippet',
    SNIPPETS: 'snippets',
    RECIPE: 'recipe',
};
/**
 * Menu names
 * @enum
 */
exports.MENU_NAMES = {
    MAIN: 'main',
    DEV_TOOL: 'devtool',
    ETHER: 'ether',
    ETHER_KOR: 'ether-kor',
    DESIGN_SYSTEM: 'design-system',
};
