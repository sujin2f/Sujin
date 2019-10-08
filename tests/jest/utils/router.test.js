const { parseMatched } = require('../../../app/utils/router');

test('Match Root', () => {
  const matched = parseMatched( '/', '/' );
  expect(matched.matched).toEqual(true);
});

test('Match Post', () => {
  const matched = parseMatched( '/:year([0-9]+)/:month([0-9]+)/:day([0-9]+)/:slug', '/2019/03/07/test-post' );
  expect(matched.year).toEqual(2019);
  expect(matched.month).toEqual(3);
  expect(matched.day).toEqual(7);
  expect(matched.slug).toEqual('test-post');
});

test('Match Category w/o page', () => {
  const matched = parseMatched( '/category/:category', '/category/cat-01' );
  expect(matched.category).toEqual('cat-01');
});

test('Match Category w/ page', () => {
  const matched = parseMatched( '/category/:category/page/:page?', '/category/cat-01/page/1' );
  expect(matched.category).toEqual('cat-01');
  expect(matched.page).toEqual(1);
});

