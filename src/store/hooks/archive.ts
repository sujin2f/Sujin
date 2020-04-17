/*
 * Archive Hooks
 * store/hooks/archive
 */

import axios from 'axios';
import {
  useContext,
  useEffect,
} from 'react';

import DEFAULT_BACKGROUND from 'assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from 'assets/images/background/category-mobile.jpg';
import { CLASS_NAME } from 'constants/dom';
import { RequestState, ResponseCode, isAvailablle } from 'constants/enum';
import { Context } from 'store';
import {
  setPageHeader,
  setPublicClass,
  loadArchiveInit,
  loadArchiveSuccess,
  loadArchiveFail,
  loadPostSuccess,
} from 'store/actions';
import { IArchive } from 'store/items/interface/archive';
import { IPost } from 'store/items/interface/post';
import { Archive } from 'store/items/archive';
import { Post } from 'store/items/post';
import { parseExImage } from 'utils/common';

const {
  publicScene: {
    STRETCHED_BACKGROUND,
    HIDE_FOOTER,
    HIDE_HEADER,
  },
} = CLASS_NAME;

const loaded = [];

// @todo not to load again and again
const useArchiveRequest = (type: string, slug: string, page: number, udpateHeader: boolean): never => {
  const [{ archive }, dispatch] = useContext(Context);
  const currentArchive = archive[type][slug] && archive[type][slug][page];
  const loadedKey = `{${type}-${slug}-${page}}`;

  // Request
  useEffect(() => {
    if (loaded.includes(loadedKey) || isAvailablle(currentArchive)) {
      return;
    }

    if (udpateHeader) {
      dispatch(setPageHeader({
        isLoading: true,
      }));
    }

    dispatch(loadArchiveInit(type, slug, page));

    axios.get(`/wp-json/sujin/v1/archive/${type}/${slug}/${page}`)
      .then((response) => {
        if (response.status === ResponseCode.Success) {
          response.data.items = response.data.items.map((entity: IPost) => {
            const post = new Post(entity);
            dispatch(loadPostSuccess(
              post.slug,
              post,
            ));

            return post;
          });

          dispatch(loadArchiveSuccess(
            type,
            slug,
            page,
            new Archive(response.data),
          ));
          return;
        }
        dispatch(loadArchiveFail(type, slug, page));
      }).catch((e) => {
        dispatch(loadArchiveFail(type, slug, page));
      });

    loaded.push(slug);
  }, [dispatch, loadedKey, page, slug, type, currentArchive, udpateHeader]);
};

const useArchiveInit = (type: string, slug: string, page: number, udpateHeader: boolean): IArchive|RequestState => {
  const [{ archive }, dispatch] = useContext(Context);
  const currentList = (archive[type][slug] && archive[type][slug][page]) || RequestState.Loading;

  useEffect(() => {
    if (!isAvailablle(currentList) || !udpateHeader) {
      return;
    }

    const backgroundImage =
      parseExImage(
        currentList.thumbnail,
        currentList.thumbnail,
        'large',
        'medium',
        DEFAULT_BACKGROUND,
        DEFAULT_BACKGROUND_MOBILE,
      );

    dispatch(setPublicClass({
      [STRETCHED_BACKGROUND]: false,
      [HIDE_FOOTER]: false,
      [HIDE_HEADER]: false,
    }));

    dispatch(setPageHeader({
      background: backgroundImage,
      backgroundColor: '',
      description: currentList.description,
      icon: '',
      isLoading: false,
      prefix: type,
      title: currentList.title,
      useBackgroundColor: false,
    }));
  }, [currentList, dispatch, type, udpateHeader]);

  return currentList;
};

export const useArchive = (type: string, slug: string, page = 1, udpateHeader = true): IArchive|RequestState => {
  useArchiveRequest(type, slug, page, udpateHeader);
  return useArchiveInit(type, slug, page, udpateHeader);
};
