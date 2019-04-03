import React from 'react';
import App from 'app/components/App';

import { STORE } from 'app/constants/common';

import selectors from 'app/selectors';
import actions from 'app/actions';
import reducer from 'app/reducers';

((wp) => {
  const { render } = wp.element;
  const { registerStore } = wp.data;

  registerStore(STORE, { reducer, selectors, actions });

  render(
    <App />,
    document.getElementById('app'),
  );
})(window.wp);
