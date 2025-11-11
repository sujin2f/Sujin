"use strict";
/**
 * Common type definition
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMAGE_POSITION = exports.POST_IMAGE_LOCATION = exports.IMAGE_SIZE = exports.IMAGE_SIZE_BACKGROUND = void 0;
/**
 * Wordpress supported image sizes
 * @enum
 */
exports.IMAGE_SIZE_BACKGROUND = {
    MEDIUM: 'medium',
    MEDIUM_LARGE: 'mediumLarge',
    LARGE: 'large',
};
/**
 * Wordpress supported image sizes
 * @enum
 */
exports.IMAGE_SIZE = {
    ...exports.IMAGE_SIZE_BACKGROUND,
    THUMBNAIL: 'thumbnail',
    POST_THUMBNAIL: 'postThumbnail',
    RELATED_POST: 'relatedPost',
    RECENT_POST: 'recentPost',
};
/**
 * Type of embed images from Wordpress Post
 * @enum
 */
exports.POST_IMAGE_LOCATION = {
    LIST: 'list',
    ICON: 'icon',
    TITLE: 'title',
    BACKGROUND: 'background',
    THUMBNAIL: 'thumbnail',
};
// @todo use this
var IMAGE_POSITION;
(function (IMAGE_POSITION) {
    IMAGE_POSITION[IMAGE_POSITION["BANNER"] = 0] = "BANNER";
    IMAGE_POSITION[IMAGE_POSITION["LIST"] = 1] = "LIST";
    IMAGE_POSITION[IMAGE_POSITION["ICON"] = 2] = "ICON";
    IMAGE_POSITION[IMAGE_POSITION["RECENT_POST"] = 3] = "RECENT_POST";
})(IMAGE_POSITION || (exports.IMAGE_POSITION = IMAGE_POSITION = {}));
