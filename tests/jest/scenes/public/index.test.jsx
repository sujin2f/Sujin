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
  const {getByText, getByTestId, container, asFragment} = render(
    <Public />,
  );

  fireEvent.click(getByTestId('hamburger'));

  console.log(getByTestId('wrapper'));


  console.log(container, asFragment());

/*
*/

//


/*
  let component = renderer.create(
    <Public />,
  );

  // Mobile Menu
  component.root.findByProps({ className: 'hide-for-large icon hamburger' }).props.onClick();
  expect(component.toJSON().props.className).toMatch(/mobile-menu/);

  // Scroll
  global.window.scrollY = 100;
  global.window.dispatchEvent(new Event('scroll'));
  expect(component.toJSON().props.className).toMatch(/scrolled/);

  component.unmount();
*/
});
