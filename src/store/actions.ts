import { IBackground } from 'store/items/interface/background';
import { IPost } from 'store/items/interface/post';
import { log } from 'utils/common';

export const SET_PUBLIC_CLASS = 'sujin/v1/SET_PUBLIC_CLASS';
export const SET_PAGE_HEADER = 'sujin/v1/SET_PAGE_HEADER';
export const LOAD_MENU_INIT = 'sujin/v1/LOAD_MENU_INIT';
export const LOAD_MENU_SUCCESS = 'sujin/v1/LOAD_MENU_SUCCESS';
export const LOAD_POST_INIT = 'sujin/v1/LOAD_POST_INIT';
export const LOAD_POST_SUCCESS = 'sujin/v1/LOAD_POST_SUCCESS';
export const LOAD_POST_FAIL = 'sujin/v1/LOAD_POST_FAIL';
export const LOAD_BACKGROUND_INIT = 'sujin/v1/LOAD_BACKGROUND_INIT';
export const LOAD_BACKGROUND_SUCCESS = 'sujin/v1/LOAD_BACKGROUND_SUCCESS';
export const LOAD_BACKGROUND_FAIL = 'sujin/v1/LOAD_BACKGROUND_FAIL';
export const LOAD_ARCHIVE_INIT = 'sujin/v1/LOAD_ARCHIVE_INIT';
export const LOAD_ARCHIVE_SUCCESS = 'sujin/v1/LOAD_ARCHIVE_SUCCESS';
export const LOAD_ARCHIVE_FAIL = 'sujin/v1/LOAD_ARCHIVE_FAIL';

export const setPublicClass = (publicClass) => {
  log(SET_PUBLIC_CLASS);
  return {
    type: SET_PUBLIC_CLASS,
    publicClass,
  };
}

export const setPageHeader = (pageHeader) => {
  log(SET_PAGE_HEADER);
  return {
    type: SET_PAGE_HEADER,
    pageHeader,
  };
}

export const loadMenuInit = (slug: string) => {
  log(LOAD_MENU_INIT);
  return {
    type: LOAD_MENU_INIT,
    slug,
  };
}

export const loadMenuSuccess = (slug: string, menuItems) => {
  log(LOAD_MENU_SUCCESS);
  return {
    type: LOAD_MENU_SUCCESS,
    slug,
    menuItems,
  };
};

export const loadPostInit = (slug: string) => {
  log(LOAD_POST_INIT);
  return {
    type: LOAD_POST_INIT,
    slug,
  };
}

// @todo slug is not neccessary
export const loadPostSuccess = (slug: string, post: IPost) => {
  log(LOAD_POST_SUCCESS);
  return {
    type: LOAD_POST_SUCCESS,
    slug,
    post,
  };
};

export const loadPostFail = (slug: string) => {
  log(LOAD_POST_FAIL);
  return {
    type: LOAD_POST_FAIL,
    slug,
  };
};

export const loadBackgroundInit = () => {
  log(LOAD_BACKGROUND_INIT);
  return {
    type: LOAD_BACKGROUND_INIT,
  };
}

export const loadBackgroundSuccess = (background: IBackground[]) => {
  log(LOAD_BACKGROUND_SUCCESS);
  return {
    type: LOAD_BACKGROUND_SUCCESS,
    background,
  };
};

export const loadBackgroundFail = () => {
  log(LOAD_BACKGROUND_FAIL);
  return {
    type: LOAD_BACKGROUND_FAIL,
  };
};

export const loadArchiveInit = (archiveType: string, slug: string, page: number) => {
  log(LOAD_ARCHIVE_INIT);
  return {
    type: LOAD_ARCHIVE_INIT,
    archiveType,
    slug,
    page,
  };
}

export const loadArchiveSuccess = (archiveType: string, slug: string, page: number, archive: IArchive) => {
  log(LOAD_ARCHIVE_SUCCESS);
  return {
    type: LOAD_ARCHIVE_SUCCESS,
    archiveType,
    slug,
    page,
    archive,
  };
};

export const loadArchiveFail = (archiveType: string, slug: string, page: number) => {
  log(LOAD_ARCHIVE_FAIL);
  return {
    type: LOAD_ARCHIVE_FAIL,
    archiveType,
    slug,
    page,
  };
};
