/*
 * Loading Component
 * components/common/Loading
 */

import React from 'react';

import IMG_loading from 'assets/images/loading.svg';

export const Loading = (): JSX.Element => {
  return (
    <section>
      <img src={IMG_loading} alt="Loading" />
    </section>
  );
};
