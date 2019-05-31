const { getPaging } = require('../../../app/utils/archive');

/*
 * Data Provider for getPaging
 * @param total page
 * @param current page
 * @param offset
 * @param expected
 */
const dataGetPaging = [
  [100, 1, 5, [1, 2, 3, 4, 5, 6, '...', 100]],
  [100, 7, 5, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, '...', 100]],
  [100, 8, 5, [1, '...', 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, '...', 100]],
  [100, 50, 5, [1, '...', 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, '...', 100]],
  ['100', '50', undefined, [1, '...', 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, '...', 100]],
  [100, 100, 5, [1, '...', 95, 96, 97, 98, 99, 100]],
  [100, 94, 5, [1, '...', 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]],
  [100, 93, 5, [1, '...', 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, '...', 100]],
  [3, 2, 5, [1, 2, 3]],
  [10, 2, 3, [1, 2, 3, 4, 5, '...', 10]],
];

describe.each(dataGetPaging)(
  'getPaging()',
  (totalPages, currentPage, offset, expected) => {
    test(`getPaging ${totalPages} ${currentPage} ${offset}`, () => {
      expect(getPaging(totalPages, currentPage, offset)).toStrictEqual(expected);
    });
  },
);
