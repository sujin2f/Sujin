/*
 * FrontPage Component
 * scenes/public/FrontPage
 */

import React, { Fragment } from 'react';

/*
import Post from 'scenes/public/Post';
import Page from 'scenes/public/Page';
*/

import { useBackground, useFrontPage } from 'store/hooks/global';

export const FrontPage = (): JSX.Element => {
  useBackground();
  useFrontPage();

  const {
    frontPage,
    showOnFront,
  } = window.sujin;

  if (frontPage === 'front-page') {
    return (<Fragment />);
  }

  if (showOnFront === 'posts') {
    return (
      <div className="stretched-background hide-footer">
        posts
      </div>
    );
  }

  if (showOnFront === 'page') {
    return (
      <div className="stretched-background hide-footer">
        page
      </div>
    );
  }

  return (<Fragment />);
};
