import Scroll from 'react-scroll';
import DEFAULT_THUMBNAIL, { DEFAULT_OG_IMAGE } from 'app/constants/thumbnail';

const imageCount = 10;

// https://stackoverflow.com/questions/10445410/getting-the-x-and-y-coordinates-for-a-div-element
export function scrollTo(id) {
  if (!id) {
    Scroll.animateScroll.scrollTo(0, { duration: 500 });
    return;
  }

  const box = document.getElementById(id).getBoundingClientRect();
  const docElem = document.documentElement;
  const { body } = document;
  const clientTop = docElem.clientTop || body.clientTop || 0;
  const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;

  Scroll.animateScroll.scrollTo((box.top + scrollTop) - clientTop, { duration: 500 });
}

/* eslint-disable max-len */
export function getLink(link) {
  if (link) {
    return link.replace(
      /http:\/\/sujinc\.com\/wordpress\/|http:\/\/sujinc\.test\/|http:\/\/sujinc\.com:7777\/|http:\/\/localhost:8000\//,
      process.env.SUJIN_BASE_URL,
    );
  }

  return '';
}
/* eslint-eable max-len */

export default scrollTo;

export const getRandomImage = () => {
  const randNumber = Math.floor(Math.random() * imageCount) + 1;
  return `/images/background/main/${randNumber}.jpg`;
};

export const getImages = (thumbnail, metaValues, defaultImage) => {
  const returning = {
    large: defaultImage || getRandomImage(),
    small: metaValues.icon,
    list: DEFAULT_THUMBNAIL,
    openGraph: DEFAULT_OG_IMAGE,
  };

  returning.large = metaValues.background || thumbnail || returning.large;
  returning.background = metaValues['use-background-color'] ? metaValues['background-color'] : null;
  returning.list = metaValues.list || thumbnail || returning.list;
  returning.title = metaValues.title || null;
  returning.openGraph = metaValues.list || metaValues.background || thumbnail || returning.openGraph;

  return returning;
};

export const getRenderedText = text => (text && text.rendered) || '';
