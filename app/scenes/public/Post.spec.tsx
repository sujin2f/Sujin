import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { shallow } from 'enzyme';

import { rawData, response } from 'app/items/rest/test-data/post.spec.data';

import { Post } from 'app/scenes/public/Post';
import RouteController from 'app/controllers/route';

const mock = new MockAdapter(axios);
mock.onGet('/wp-json/sujin/v1/post/test').reply(200, rawData);

it('app/scenes/public/FrontPage', async () => {
  RouteController.getInstance().setMatched({
    matched: true,
    slug: 'test',
  });
  const wrapper = shallow(<Post />);
  const instance = wrapper.instance();
  const controller = instance.getController();

  await instance.request();

  expect(controller.entity).toEqual(response);
});
