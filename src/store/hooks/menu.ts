/*
 * Menu Hooks
 * store/hooks/menu
 */

import {
  useContext,
  useEffect,
} from 'react';
import axios from 'axios';

import { ResponseCode, RequestState } from 'constants/enum';
import { Context } from 'store';
import { loadMenuInit, loadMenuSuccess } from 'store/actions';
import { IMenu } from 'store/items/interface/menu';
import { Menu } from 'store/items/menu';
import { log } from 'utils/common';

const loaded = [];

export const useMenu = (slug: string): IMenu|RequestState => {
  const [{ menu }, dispatch] = useContext(Context);

  useEffect(() => {
    if (loaded.includes(slug)) {
      return;
    }

    dispatch(loadMenuInit(slug));

    axios.get(`/wp-json/sujin/v1/menu/${slug}`)
      .then((response) => {
        if (response.status === ResponseCode.Success) {
          dispatch(loadMenuSuccess(
            slug,
            response.data.map((item) => new Menu(item)),
          ));
          return;
        }
      }).catch((e) => {
        log([`axios.get has been failed on menu/${slug}`, e], 'error');
      });

    loaded.push(slug);
  }, [dispatch, slug]);

  return menu[slug];
};
