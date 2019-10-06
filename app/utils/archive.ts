/* eslint-disable import/prefer-default-export */

export const getPaging = (total: number, current: number = 1, offset: number = 5): Array<number> => {
  let entities = [];

  if (!total) {
    return entities;
  }

  const start = (current - offset) > 2 ? current - offset : 1;
  const end = (current + offset) < (total - 1) ? current + offset : total;

  if (start > 2) {
    entities.push(1);
    entities.push(-1);
  }

  entities = [
    ...entities,
    ...Array.from(Array(end - start + 1).keys()).map(v => v + start),
  ];

  if (end < total - 1) {
    entities.push(-1);
    entities.push(total);
  }

  return entities;
};

/* eslint-enable import/prefer-default-export */
