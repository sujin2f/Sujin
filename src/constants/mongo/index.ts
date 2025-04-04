import { ARCHIVE } from '@src/types/wordpress'

export enum COLLECTION {
    POST = 'post',
    PAGE = 'page',
    BACKGROUNDS = 'background',
    CATEGORY = ARCHIVE.CATEGORY,
    TAG = ARCHIVE.TAG,
    OPTIONS = 'option',
    SPECTRA = 'spectra',
    USERS = 'user',
}
