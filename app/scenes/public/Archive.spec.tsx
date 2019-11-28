import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { shallow } from 'enzyme';

import { rawData, response } from 'app/items/rest/test-data/archive.spec.data';

import Archive from './Archive';
import RouteController from 'app/controllers/route';
import { TermTypes } from 'app/constants/enum';

const mock = new MockAdapter(axios);
mock.onGet('/wp-json/sujin/v1/archive/category/blog/1').reply(200, rawData);

it('app/scenes/public/FrontPage', async () => {
  RouteController.getInstance().setMatched({
    matched: true,
    slug: 'blog',
    type: TermTypes.Category,
    page: 1,
  });

  const wrapper = shallow(<Archive />);
  const instance = wrapper.instance();
  const controller = instance.getController();

  await instance.request();

  expect(controller.entity).toEqual(response);
});
