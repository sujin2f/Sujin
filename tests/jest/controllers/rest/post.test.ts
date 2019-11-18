import ComponentMock from '../../__mocks__/component.mock';
import mock from '../../__mocks__/axios.mock';
import data from './post.test.data';

import PostController from 'app/controllers/rest/post';
import Post from 'app/items/rest/post';

mock.onGet('/wp-json/sujin/v1/post/test').reply(200, data);

test('PostController', () => {
  mock.onAny().reply(200, data);
  const promise = PostController.getInstance('test').addComponent(ComponentMock).request().promise;
  return promise.then(() => {
    const entity = PostController.getInstance('test').entity;

    console.log(entity);
    console.log(PostController.getInstance('test'));
    mock.reset();
  }).catch(() => {
    return expect(true).toBe(false);
  });
});
