import GlobalController from 'app/controllers/global';
import ComponentMock from '../__mocks__/component.mock';

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
