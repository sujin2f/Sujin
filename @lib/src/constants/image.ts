/**
 * Wordpress supported image sizes
 * @enum
 */
export enum IMAGE_SIZE_BACKGROUND {
    MEDIUM = 'medium',
    MEDIUM_LARGE = 'mediumLarge',
    LARGE = 'large',
}

/**
 * Wordpress supported image sizes
 * @enum
 */
export enum IMAGE_SIZE {
    MEDIUM = 'medium',
    MEDIUM_LARGE = 'mediumLarge',
    LARGE = 'large',
    THUMBNAIL = 'thumbnail',
    POST_THUMBNAIL = 'postThumbnail',
    RELATED_POST = 'relatedPost',
    RECENT_POST = 'recentPost',
}

/**
 * Type of embed images from Wordpress Post
 * @enum
 */
export enum POST_IMAGE_LOCATION {
    LIST = 'list',
    ICON = 'icon',
    TITLE = 'title',
    BACKGROUND = 'background',
    THUMBNAIL = 'thumbnail',
}

// TODO use this
export enum IMAGE_POSITION {
    BANNER,
    LIST,
    ICON,
    RECENT_POST,
}
