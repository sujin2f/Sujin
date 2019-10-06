import {
  REQUEST_ARCHIVE_INIT,
  REQUEST_ARCHIVE_SUCCESS,
  REQUEST_ARCHIVE_FAIL,
} from 'app/constants/redux';

export interface RequestArchiveInit {
  type: REQUEST_ARCHIVE_INIT;
  kind: string;
  slug: string;
  page: string;
}

export interface RequestArchiveSuccess {
  type: REQUEST_ARCHIVE_SUCCESS;
  kind: string;
  slug: string;
  page: string;
  response: any;
}

export interface RequestArchiveFail {
  type: REQUEST_ARCHIVE_FAIL;
  code: string;
  kind: string;
  slug: string;
  page: string;
}
