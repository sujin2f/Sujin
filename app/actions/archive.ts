// TODO response and error type

import {
  REQUEST_ARCHIVE_INIT,
  REQUEST_ARCHIVE_SUCCESS,
  REQUEST_ARCHIVE_FAIL,
} from 'app/constants/redux';

import {
  RequestArchiveInit,
  RequestArchiveSuccess,
  RequestArchiveFail,
} from 'app/types/actions/archive';

export function requestArchiveInit(page: string, kind: string, slug: string): RequestArchiveInit {
  return {
    type: REQUEST_ARCHIVE_INIT,
    kind,
    slug,
    page,
  };
}

export function requestArchiveSuccess(page: string, kind: string, slug: string, response: any): RequestArchiveSuccess {
  return {
    type: REQUEST_ARCHIVE_SUCCESS,
    kind,
    slug,
    page,
    response,
  };
}

export function requestArchiveFail(code: string, page: string, kind: string, slug: string): RequestArchiveFail {
  return {
    type: REQUEST_ARCHIVE_FAIL,
    code,
    kind,
    slug,
    page,
  };
}
