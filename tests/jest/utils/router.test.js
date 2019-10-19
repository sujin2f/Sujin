import RouteController from 'app/controllers/route';

test('Match Root', () => {
  const matched = RouteController.getInstance().parseMatched('/');
  expect(matched.matched).toEqual(true);
});

test('Match Post', () => {
  RouteController.getInstance().history.push('/2019/03/07/test-post');
  const matched = RouteController.getInstance().parseMatched('/:year([0-9]+)/:month([0-9]+)/:day([0-9]+)/:slug');
  expect(matched.year).toEqual(2019);
  expect(matched.month).toEqual(3);
  expect(matched.day).toEqual(7);
  expect(matched.slug).toEqual('test-post');
});

test('Match Category w/o page', () => {
  RouteController.getInstance().history.push('/category/cat-01');
  const matched = RouteController.getInstance().parseMatched('/category/:category');
  expect(matched.category).toEqual('cat-01');
});

test('Match Category w/ page', () => {
  RouteController.getInstance().history.push('/category/cat-01/page/1');
  const matched = RouteController.getInstance().parseMatched('/category/:category/page/:page?');
  expect(matched.category).toEqual('cat-01');
  expect(matched.page).toEqual(1);
});

