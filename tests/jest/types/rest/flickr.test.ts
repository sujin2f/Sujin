import ComponentMock from '../component.mock';
import mock from '../axios.mock';
import data from './flickr.test.data';

import FlickrController from 'app/controllers/rest/flickr';

mock.onGet('/wp-json/sujin/v1/flickr/').reply(200, data);

test('FlickrController', () => {
  const promise = FlickrController.getInstance().request(ComponentMock);

  return promise.then(() => {
    const entities = FlickrController.getInstance().getItems();

    expect(entities[0].title).toBe(data[0].title);
    expect(entities[1].title).toBe(data[1].title);
    expect(entities[0].media).toBe(data[0].media);
    expect(entities[1].media).toBe(data[1].media);
  }).catch(() => {
    return expect(true).toBe(false);
  });
});
