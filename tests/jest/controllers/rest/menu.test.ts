import ComponentMock from '../../__mocks__/component.mock';
import mock from '../../__mocks__/axios.mock';
import data from './menu.test.data';

import MenuController from 'app/controllers/rest/menu';
import Menu from 'app/items/rest/menu';

mock.onGet('/wp-json/sujin/v1/menu/main').reply(200, data);

test('MenuController', () => {
  const promise = MenuController.getInstance('main').addComponent(ComponentMock).request().promise;
  return promise.then(() => {
    const entities = MenuController.getInstance('main').entities;

    return expect(entities[0] instanceof Menu).toBe(true);
    return expect(entities[0].children[0] instanceof Menu).toBe(true);
    return expect(entities[1] instanceof Menu).toBe(true);
  }).catch(() => {
    return expect(true).toBe(false);
  });
});
