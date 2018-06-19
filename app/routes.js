import React from 'react';

// Screens
import FrontPage from 'app/scenes/public/screens/FrontPage';
import Page from 'app/scenes/public/screens/Page';
import Archive from 'app/scenes/public/screens/Archive';
import Post from 'app/scenes/public/screens/Post';

import NotFound from 'app/scenes/public/screens/NotFound';

export default {
  public: [
    {
      path: `${process.env.SUJIN_BASE_URL}`,
      component: FrontPage,
      exact: true,
    },
    {
      path: `${process.env.SUJIN_BASE_URL}:pageSlug`,
      exact: true,
      render: (props) => {
        if (props.match.params.pageSlug === '404') {
          return (<NotFound {...props} />);
        }

        return (<Page {...props} />);
      },
    },
    {
      path: `${process.env.SUJIN_BASE_URL}:year(\\d+)/:month(\\d+)/:day(\\d+)/:postSlug`,
      component: Post,
      exact: true,
    },
    {
      path: `${process.env.SUJIN_BASE_URL}category/:category`,
      component: Archive,
      exact: true,
    },
    {
      path: `${process.env.SUJIN_BASE_URL}category/:category/page/:paged?`,
      component: Archive,
      exact: true,
    },
    {
      path: `${process.env.SUJIN_BASE_URL}tag/:tag`,
      component: Archive,
      exact: true,
    },
    {
      path: `${process.env.SUJIN_BASE_URL}tag/:tag/page/:paged?`,
      component: Archive,
      exact: true,
    },
    {
      path: `${process.env.SUJIN_BASE_URL}search/:searchString`,
      component: Archive,
      exact: true,
    },
    {
      path: `${process.env.SUJIN_BASE_URL}search/:searchString/page/:paged?`,
      component: Archive,
      exact: true,
    },
    {
      path: null,
      component: NotFound,
    },
  ],
};
