export const REQUEST_ARCHIVE_INIT = 'sujin/archive/REQUEST_ARCHIVE_INIT';
export const REQUEST_ARCHIVE_SUCCESS = 'sujin/archive/REQUEST_ARCHIVE_SUCCESS';
export const REQUEST_ARCHIVE_FAIL = 'sujin/archive/REQUEST_ARCHIVE_FAIL';

export function requestArchiveInit(page, kind, slug) {
  return {
    type: REQUEST_ARCHIVE_INIT,
    kind,
    slug,
    page,
  };
}

export function requestArchiveSuccess(page, kind, slug, response) {
  return {
    type: REQUEST_ARCHIVE_SUCCESS,
    kind,
    slug,
    page,
    response,
  };
}

export function requestArchiveFail(code, page, kind, slug) {
  return {
    type: REQUEST_ARCHIVE_FAIL,
    code,
    kind,
    slug,
    page,
  };
}
