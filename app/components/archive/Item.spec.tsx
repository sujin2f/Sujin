/** app/components/archive/Item.spec */

// Modules
import { shallow } from 'enzyme';

// Component
import Item from 'app/components/archive/Item';

// Test Data
import { response } from 'app/items/rest/test-data/post.spec.data';

it('app/components/archive/Item', () => {
  const wrapper = shallow(<Item item={response.related[0]} />);

  expect(wrapper.find('.day').exists()).toEqual(true);
  expect(wrapper.find('.month').exists()).toEqual(true);
  expect(wrapper.find('.year').exists()).toEqual(true);

  expect(wrapper.find('.description').exists()).toEqual(true);
});
