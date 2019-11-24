// TODO move to scene
import RouteController from 'app/controllers/route';
import ComponentMock from '../__mocks__/component.mock';
import eventMock from '../__mocks__/event.mock';

global.scrollTo = jest.fn();

test('Match Root', () => {
  const matched = RouteController.getInstance(ComponentMock).parseMatched('/');
  expect(matched.matched).toEqual(true);
});

test('Match Post', () => {
  const route = RouteController.getInstance(ComponentMock);
  route.pushHash(eventMock, '/2019/03/07/test-post', '_self');

  const matched = route.parseMatched('/:year([0-9]+)/:month([0-9]+)/:day([0-9]+)/:slug');
  expect(matched.slug).toEqual('test-post');
});

test('Match Category w/o page', () => {
  const route = RouteController.getInstance(ComponentMock);
  route.pushHash(eventMock, '/category/cat-01', '_self');
  const matched = route.parseMatched('/:type/:slug');

  expect(matched.type).toEqual('category');
  expect(matched.slug).toEqual('cat-01');
});

test('Match Category w/ page', () => {
  const route = RouteController.getInstance(ComponentMock);
  route.pushHash(eventMock, '/category/cat-01/page/2', '_self');
  const matched = route.parseMatched('/:type/:slug/page/:page?');

  expect(matched.type).toEqual('category');
  expect(matched.slug).toEqual('cat-01');
  expect(matched.page).toEqual(2);
});
