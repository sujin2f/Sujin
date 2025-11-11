"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TAXONOMY = exports.ARCHIVE = void 0;
/**
 * Archive types
 * @enum
 */
exports.ARCHIVE = {
    CATEGORY: 'category',
    TAG: 'tag',
    SEARCH: 'search',
};
/**
 * WP Taxonomies
 * @enum
 */
exports.TAXONOMY = {
    ...exports.ARCHIVE,
    POST_TAG: 'post_tag',
};
