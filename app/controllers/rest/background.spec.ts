// import ComponentMock from '../../__mocks__/component.mock';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import BackgroundController from 'app/controllers/rest/background';
import { rawData } from 'app/items/rest/background.spec.data';
const mock = new MockAdapter(axios);

mock.onGet('/wp-json/sujin/v1/background/random/').reply(200, rawData);

class ComponentMock {
  static forceUpdate() {}
}

test('BackgroundController', async () => {
  await BackgroundController.getInstance().addComponent(ComponentMock).request().promise;
  const entities = BackgroundController.getInstance().entities;

  expect(entities[0].desktop).toBe('http://test.org/desktop.jpg');
  expect(entities[0].mobile).toBe('http://test.org/mobile.jpg');
  expect(entities[0].title).toBe('Title 01');

  const image = BackgroundController.getInstance().getBackgroundImage();
  expect(['http://test.org/desktop.jpg', 'http://test.org/desktop.svg']).toContain(image);
});
