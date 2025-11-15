import { POST_TYPE } from '.'

/**
 * MongoDB collections
 * @enum
 */
export enum COLLECTION {
    POST = `${POST_TYPE.POST}s`,
    PAGE = `${POST_TYPE.PAGE}s`,
    BACKGROUNDS = 'backgrounds',
    OPTIONS = 'option',
    SPECTRA = 'spectra',
    USERS = 'user',
    ARCHIVE = 'archives',
    SNIPPET = 'snippet',
    SNIPPETS = 'snippets',
    RECIPE = 'recipe',
}
