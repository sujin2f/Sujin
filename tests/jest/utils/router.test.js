const { getMatched } = require('../../../app/utils/router');

test('Match Root', () => {
  const matched = getMatched( '/', '/' );
  expect(matched.matched).toEqual({ matched: true });
});

test('Match Post', () => {
  const matched = getMatched( '/:year([0-9]+)/:month([0-9]+)/:day([0-9]+)/:postSlug', '/2019/03/07/test-post' );
  expect(matched.matched.year).toEqual('2019');
  expect(matched.matched.month).toEqual('03');
  expect(matched.matched.day).toEqual('07');
  expect(matched.matched.postSlug).toEqual('test-post');
});

test('Match Category w/o page', () => {
  const matched = getMatched( '/category/:category', '/category/cat-01' );
  expect(matched.matched.category).toEqual('cat-01');
});

test('Match Category w/ page', () => {
  const matched = getMatched( '/category/:category/page/:page?', '/category/cat-01/page/1' );
  expect(matched.matched.category).toEqual('cat-01');
  expect(matched.matched.page).toEqual('1');
});

