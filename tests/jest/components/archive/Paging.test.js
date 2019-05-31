import React from 'react';
import Paging from '../../../app/components/archive/Paging';
import renderer from 'react-test-renderer';

test('Paging', () => {
  let component = renderer.create(
    <Paging totalPages="100" currentPage="50" urlPrefix="category/test" />,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
