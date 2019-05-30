/* eslint-disable import/prefer-default-export */

export const getPaging = (totalPages, currentPage = 1, offset = 5) => {
  let entities = [];

  if (!totalPages) {
    return entities;
  }

  const start = (currentPage - offset) > 2 ? currentPage - offset : 1;
  const end = (currentPage + offset) < totalPages -1 ? currentPage + offset : totalPages;

  if (start > 2) {
    entities.push(1);
    entities.push('...');
  }

  entities = [
    ...entities,
    ...Array.from(Array(end - start + 1).keys()).map(v => v + start),
  ];

  if (end < totalPages - 1) {
    entities.push('...');
    entities.push(totalPages);
  }

  return entities;
};

/* eslint-enable import/prefer-default-export */
