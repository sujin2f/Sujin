import React from 'react';
import Public from '../../../app/scenes/public';
import renderer from 'react-test-renderer';

test('Public', () => {
  let component = renderer.create(
    <Public />,
  );

  // Mobile Menu
  component.root.findByProps({ className: 'hide-for-large icon hamburger' }).props.onClick();
  expect(component.toJSON().props.className).toMatch(/mobile-menu/);

  // Scroll
  global.window.scrollY = 100;
  global.window.dispatchEvent(new Event('scroll'));
  expect(component.toJSON().props.className).toMatch(/scrolled/);

  component.unmount();
});
