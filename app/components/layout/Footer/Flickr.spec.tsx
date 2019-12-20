/** app/components/layout/Footer/Flickr.spec */

// Modules
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { shallow } from 'enzyme';

// Component
import Flickr from 'app/components/layout/Footer/Flickr';

// Test Data
import { rawData, response } from 'app/items/rest/test-data/flickr.spec.data';

// Mock
const mock = new MockAdapter(axios);
mock.onGet('/wp-json/sujin/v1/flickr').reply(200, rawData);

it('app/components/layout/Footer/Flickr', async () => {
  const wrapper = shallow(<Flickr />);
  const instance = wrapper.instance();
  const controller = instance.getController();

  await instance.request();

  expect(controller.entities).toEqual(response);
});
