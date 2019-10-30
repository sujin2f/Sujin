import ComponentMock from '../../__mocks__/component.mock';
import mock from '../../__mocks__/axios.mock';
import data from './background.test.data';

import BackgroundController from 'app/controllers/rest/background';

mock.onGet('/wp-json/sujin/v1/media/random/').reply(200, data);

test('BackgroundController', () => {
  const promise = BackgroundController.getInstance().addComponent(ComponentMock).request().promise;
  return promise.then(() => {
    const entities = BackgroundController.getInstance().entities;
    
    expect(entities[0].desktop).toBe(data[0].desktop);
    expect(entities[0].mobile).toBe(data[0].mobile);
    expect(entities[0].title).toBe(data[0].title);
    
    const image = BackgroundController.getInstance().getBackgroundImage();
    expect(image).toBe(data[0].desktop || data[1].desktop);
  }).catch(() => {
    return expect(true).toBe(false);
  });
});
