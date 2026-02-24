import { POST_TYPE } from '.'

/**
 * MongoDB collections
 * @enum
 */
export enum COLLECTION {
    POST = `${POST_TYPE.POST}s`,
    PAGE = `${POST_TYPE.PAGE}s`,
    BACKGROUNDS = 'backgrounds',
    OPTIONS = 'options',
    SPECTRA = 'spectrum',
    USERS = 'users',
    ARCHIVE = 'archives',
    RECIPE = 'recipes',
    MENU = 'menus',
    BOOKMARK = 'focus-bookmark',
}
