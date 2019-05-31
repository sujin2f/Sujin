/* eslint-disable import/prefer-default-export */

export const getPaging = (totalPages, currentPage = 1, offsetValue = 5) => {
  let entities = [];
  const total = parseInt(totalPages, 10);
  const current = parseInt(currentPage, 10);
  const offset = parseInt(offsetValue, 10);

  if (!total) {
    return entities;
  }

  const start = (current - offset) > 2 ? current - offset : 1;
  const end = (current + offset) < (total - 1) ? current + offset : total;

  if (start > 2) {
    entities.push(1);
    entities.push('...');
  }

  entities = [
    ...entities,
    ...Array.from(Array(end - start + 1).keys()).map(v => v + start),
  ];

  if (end < total - 1) {
    entities.push('...');
    entities.push(total);
  }

  return entities;
};

/* eslint-enable import/prefer-default-export */
