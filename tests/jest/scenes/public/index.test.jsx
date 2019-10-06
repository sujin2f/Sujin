import React from 'react';
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
} from '@testing-library/react';

import 'jest-dom/extend-expect';
// import axiosMock from 'axios';

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import Public from '../../../../app/scenes/public';
// import renderer from 'react-test-renderer';

const mock = new MockAdapter(axios);

mock.onGet('/wp-json/sujin/v1/menu/main-menu').reply(200, []);
mock.onGet('/wp-json/sujin/v1/menu/social-media').reply(200, []);

afterEach(cleanup);

test('Public', async () => {
/*
  const {getByText, getByTestId, container, asFragment} = render(
    <Public />,
  );

  fireEvent.click(getByTestId('hamburger'));
*/
});
