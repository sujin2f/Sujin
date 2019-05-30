import React from 'react';
import Paging from '../../../app/components/archive/Paging';
import renderer from 'react-test-renderer';

test('Link changes the class when hovered', () => {
  let component = renderer.create(
    <Paging totalPages="100" currentPage="3" urlPrefix="category/test" />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  component = renderer.create(
    <Paging totalPages="10" currentPage="5" urlPrefix="category/test" />,
  );
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
