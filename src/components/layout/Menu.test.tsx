/** components/layout/Menu.test */

import React from 'react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { render, waitForElement } from '@testing-library/react';

import { Menu } from 'components/layout/Menu';
import { Store } from 'store';
import { rawData } from 'store/items/test-data/menu.spec.data';

const mock = new MockAdapter(axios);
mock.onGet('/wp-json/sujin/v1/menu/main-menu').reply(200, rawData);

test('components/layout/Menu', async () => {
  const { container, getByText } = render(
    <Store>
      <Menu slug="main-menu" />
    </ Store>
  );

  await waitForElement(() => container.querySelector('.menu'), { container });

  rawData.forEach((data) => {
    expect(typeof getByText(data.title)).toEqual('object');
  });
});
