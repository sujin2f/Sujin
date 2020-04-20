/*
 * Content Component
 * components/single/Content
 */

import React, { useEffect } from 'react';

import { CLASS_NAME } from 'constants/dom';
import { Post } from 'store/items/post';
import { parseContent, parseSeries } from 'utils/single';
import { Carousel } from 'components/single/Carousel';

interface Props {
  post: Post;
  className?: string;
  children?: JSX.Element|JSX.Element[]|undefined;
}

export const Content = (props: Props): JSX.Element => {
  const {
    post: {
      id,
      slug,
      content,
      series,
      type,
    },
    className,
    children,
  } = props;

  const contents = [
    ...parseSeries(id, series),
    ...parseContent(content),
  ];

  useEffect((): void => {
    const carousels = document.getElementsByClassName(CLASS_NAME.carousel.CAROUSEL);

    if (carousels.length === 0) {
      return;
    }

    Array.from(carousels).forEach((element: Element): void => {
      if (element.getAttribute('data-loaded')) {
        return;
      }
      // tslint:disable-next-line: no-unused-expression
      new Carousel(element);
      element.setAttribute('data-loaded', 'loaded');
    });
  }, [contents]);

  return (
    <article
      className={`${className} ${type}-${slug} post-${id}`}
      itemProp="mainEntity"
      itemType="http://schema.org/BlogPosting"
    >
      {contents}

      <footer className="layout__main__content__footer">
        {children}
      </footer>
    </article>
  );
};
