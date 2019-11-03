import ComponentMock from '../../__mocks__/component.mock';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import data from './flickr.test.data';

import FlickrController from 'app/controllers/rest/flickr';

const mock = new MockAdapter(axios);
mock.onGet('/wp-json/sujin/v1/flickr/').reply(200, data);

test('FlickrController', () => {
  const promise = FlickrController.getInstance().addComponent(ComponentMock).request().promise;
  return promise.then(() => {
    const entities = FlickrController.getInstance().entities;

    expect(entities[0].title).toBe(data[0].title);
    expect(entities[1].title).toBe(data[1].title);
    expect(entities[0].media).toBe(data[0].media);
    expect(entities[1].media).toBe(data[1].media);
  }).catch(() => {
    return expect(true).toBe(false);
  });
});
