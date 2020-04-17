/** store/hooks/global */
import axios from 'axios';
import {
  useContext,
  useEffect,
  useRef,
} from 'react';

import { CLASS_NAME } from 'constants/dom';
import { ResponseCode } from 'constants/enum';
import { TOP_MENU_SCROLLED_POSITION } from 'constants/common';
import { Context } from 'store';
import {
  setPageHeader,
  setPublicClass,
  loadBackgroundInit,
  loadBackgroundSuccess,
  loadBackgroundFail,
} from 'store/actions';
import { Background } from 'store/items/background';
import { log } from 'utils/common';

const {
  publicScene: {
    SCROLLED,
    STRETCHED_BACKGROUND,
    HIDE_FOOTER,
    HIDE_HEADER,
  },
} = CLASS_NAME;

export const usePublicClassName = (): [string, object] => {
  const [{ publicClass }, dispatch] = useContext(Context);
  const wrapperElement = useRef(null)

  useEffect(() => {
    function handleScrollChange() {
      const scrolled = wrapperElement.current.classList.contains('scrolled');

      if (window.scrollY > TOP_MENU_SCROLLED_POSITION && !scrolled) {
        dispatch(setPublicClass({
          [SCROLLED]: true,
        }));
      }

      if (window.scrollY <= TOP_MENU_SCROLLED_POSITION && scrolled) {
        dispatch(setPublicClass({
          [SCROLLED]: false,
        }));
      }
    }

    window.addEventListener('scroll', (): void => handleScrollChange());
  }, [dispatch]);

  return [
    Object.keys(publicClass)
      .filter(key => publicClass[key])
      .join(' '),
    wrapperElement,
  ];
};

export const useBackground = (): void => {
  const [{ background }, dispatch] = useContext(Context);

  useEffect(() => {
    if (background) {
      return;
    }

    dispatch(loadBackgroundInit());

    axios.get('/wp-json/sujin/v1/background/random/')
      .then((response) => {
        if (response.status === ResponseCode.Success) {
          dispatch(loadBackgroundSuccess(
            response.data.map((item) => new Background(item)),
          ));
          return;
        }
        dispatch(loadBackgroundFail());
      }).catch((e) => {
        log(['axios.get has been failed on background/random', e], 'error');
        dispatch(loadBackgroundFail());
      });
  }, [dispatch, background]);
};

export const useFrontPage = (): void => {
  const [{ background }, dispatch] = useContext(Context);

  useEffect(() => {
    const {
      title,
      description,
      frontPage,
      hideFrontFooter,
      hideFrontHeader,
    } = window.sujin;

    if (frontPage === 'front-page') {
      dispatch(setPublicClass({
        [STRETCHED_BACKGROUND]: true,
        [HIDE_FOOTER]: true,
        [HIDE_HEADER]: false,
      }));

      dispatch(setPageHeader({
        background,
        backgroundColor: '',
        description,
        icon: '',
        isLoading: false,
        prefix: '',
        title: title.toUpperCase(),
        useBackgroundColor: false,
      }));
    } else {
      if (hideFrontFooter) {
        dispatch(setPublicClass({
          [HIDE_FOOTER]: true,
        }));
      }

      if (hideFrontHeader) {
        dispatch(setPublicClass({
          [HIDE_HEADER]: true,
        }));
      }
    }
  }, [dispatch, background]);
};
