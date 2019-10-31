import { STORE } from 'app/constants/common';
const { dispatch, select } = wp.data;

test('Global', async () => {
  // setTitle
/*
  dispatch(STORE)
    .setTitle('title')
    .then((action) => {
      const actual = select(STORE).getTitle();
      const expected = 'title';

      expect(actual).toEqual(expected);
    });
*/

  // setTitle
/*
  dispatch(STORE)
    .setMobileMenu('title')
    .then((action) => {
      const actual = select(STORE).getMenu('mobile');
      const expected = 'title';

      expect(actual).toEqual(expected);
    });
*/
});

test('Front Page', async () => {
/*
  const entities = [{
    desktop: 'desktop',
    mobile: 'mobile',
  }];

  dispatch(STORE)
    .requestMainBackgroundSuccess(entities)
    .then((action) => {
      const actual = select(STORE).getMainBackground();
      const expected = entities;

      expect(actual).toEqual(expected);
    });
*/
});
