import GlobalController from 'app/controllers/global';

test('GlobalController: Mobile Menu', () => {
  const global = GlobalController.getInstance();

  expect(global.mobileMenuClass).toBe('');
  global.setMobileMenu()
  expect(global.mobileMenuClass).toBe('mobile-menu');
  global.setMobileMenu(false)
  expect(global.mobileMenuClass).toBe('');
  global.setMobileMenu(true)
  expect(global.mobileMenuClass).toBe('mobile-menu');
});

test('GlobalController: <head.title />', () => {
  const global = GlobalController.getInstance();

  global.setTitle('Sujin');
  expect(document.title).toBe('Sujin');
});

/*
 * Data Provider for getScrolled
 * @param scrollY
 * @param scrolled before
 * @param expected
 */
const dataGetScrolled = [
  [100, 'scrolled'],
  [0, ''],
];

describe.each(dataGetScrolled)(
  'GlobalController',
  (scrollY, expected) => {
    test(`Scrolled ${scrollY}`, () => {
      const global = GlobalController.getInstance();
      global.setScroll(() => {});
      window['scrollY'] = scrollY;
      expect(global.scrollClass).toBe(expected);
    });
  },
);
