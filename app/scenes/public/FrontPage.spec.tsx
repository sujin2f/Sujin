import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import { shallow } from 'enzyme';

import { rawData, Backgrounds } from 'app/items/rest/background.spec.data';

import FrontPage from './FrontPage';

const mock = new MockAdapter(axios);
mock.onGet('/wp-json/sujin/v1/background/random/').reply(200, rawData);

it('app/scenes/public/FrontPage', async () => {
  const wrapper = shallow(<FrontPage />);
  const instance = wrapper.instance();
  const controller = instance.getController();

  await instance.request();

  expect(controller.entities).toEqual(Backgrounds);

  const backgroundImage = controller.getBackgroundImage();
  expect([rawData[0].desktop, rawData[1].desktop]).toContain(backgroundImage);
});