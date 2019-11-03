import GlobalController from 'app/controllers/global';
import ComponentMock from '../__mocks__/component.mock';

/*
 * Data Provider for GlobalController.setMobileMenu()
 * @param ?boolean passed value
 * @param string   mobile menu CSS class
 */
const dataSetMobileMenu = [
  [false, ''],
  [null, 'mobile-menu'],
  [null, ''],
  [true, 'mobile-menu'],
];

describe.each(dataSetMobileMenu)(
  'GlobalController.setMobileMenu()',
  (input, expected) => {
    test(`GlobalController.setMobileMenu(${input})`, () => {
      const global = GlobalController.getInstance(ComponentMock);

      global.setMobileMenu(input)
      expect(global.mobileMenuClass).toBe(expected);
    });
  },
);

/*
 * Test the <head.title />
 */
test('GlobalController.setTitle("Sujin")', () => {
  const global = GlobalController.getInstance().setComponent(ComponentMock);

  global.setTitle('Sujin');
  expect(document.title).toBe('Sujin');
});

/*
 * Data Provider for GlobalController.setScroll()
 * @param ?number Scroll Y
 * @param string  Scrolled CSS class
 */
const dataSetScroll = [
  [300, 'scrolled'],
  [0, ''],
];

describe.each(dataSetScroll)(
  'GlobalController.setScroll()',
  (input, expected) => {
    test(`GlobalController.setScroll(): ${input}`, () => {
      // Catching events
      const events = {};
      window.addEventListener = jest.fn((e, cb) => {
        events[e] = cb;
      });

      const global = GlobalController.getInstance().setComponent(ComponentMock);

      // Trigger the event listener
      global.setScroll();
    
      // Trigger the event
      window.scrollY = 300;
      events.scroll({});
    
      expect(global.scrollClass).toBe('scrolled');
    });
  },
);
