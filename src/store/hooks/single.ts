/*
 * Single Hooks
 * store/hooks/single
 */

import axios from 'axios';
import {
  useContext,
  useEffect,
} from 'react';

import DEFAULT_BACKGROUND from 'assets/images/background/category.jpg';
import DEFAULT_BACKGROUND_MOBILE from 'assets/images/background/category-mobile.jpg';
import { ResponseCode, isAvailablle } from 'constants/enum';
import { CLASS_NAME } from 'constants/dom';
import { Context } from 'store';
import {
  loadPostInit,
  loadPostSuccess,
  loadPostFail,
  setPageHeader,
  setPublicClass,
} from 'store/actions';
import { IPost } from 'store/items/interface/post';
import { Post } from 'store/items/post';
import { parseExImage } from 'utils/common';

const loaded = [];
const {
  publicScene: {
    STRETCHED_BACKGROUND,
    HIDE_FOOTER,
    HIDE_HEADER,
  },
} = CLASS_NAME;

const usePostRequest = (slug: string): never => {
  const [{ posts }, dispatch] = useContext(Context);
  const currentPost = posts[slug];

  // Request
  useEffect(() => {
    if (loaded.includes(slug) || isAvailablle(currentPost)) {
      return;
    }

    dispatch(setPageHeader({
      isLoading: true,
    }));

    dispatch(loadPostInit(slug));

    axios.get(`/wp-json/sujin/v1/post/${slug}`)
      .then((response) => {
        if (response.status === ResponseCode.Success) {
          dispatch(loadPostSuccess(
            slug,
            new Post(response.data),
          ));
          return;
        }
        dispatch(loadPostFail(slug));
      }).catch((e) => {
        dispatch(loadPostFail(slug));
      });

    loaded.push(slug);
  }, [dispatch, slug, currentPost]);
}

const usePostInit = (slug: string): IPost|RequestState => {
  const [{ posts }, dispatch] = useContext(Context);
  const currentPost = posts[slug];

  useEffect(() => {
    if (!isAvailablle(currentPost)) {
      return;
    }

    const backgroundImage =
      parseExImage(
        currentPost.meta.background,
        currentPost.thumbnail,
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
      backgroundColor: currentPost.meta.backgroundColor || '',
      description: currentPost.excerpt,
      icon: currentPost.meta.icon.small || '',
      isLoading: false,
      prefix: '',
      title: currentPost.title,
      useBackgroundColor: currentPost.meta.useBackgroundColor || false,
    }));
  }, [currentPost, dispatch]);

  return currentPost;
};

export const usePost = (slug: string): IPost|RequestState => {
  usePostRequest(slug);
  return usePostInit(slug);
};
