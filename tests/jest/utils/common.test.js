const {
  getScrolled,
  isMobile,
  getRenderedText,
  parseJson,
  parseDate,
} = require('../../../app/utils/common');

/*
 * Data Provider for getScrolled
 * @param scrollY
 * @param scrolled before
 * @param expected
 */
const dataGetScrolled = [
  [100, false, 'scrolled'],
  [100, true, false],
  [0, false, false],
  [0, true, false],
];

describe.each(dataGetScrolled)(
  'getScrolled()',
  (scrollY, scrolled, expected) => {
    test(`Scrolled ${scrollY}, ${scrolled}`, () => {
      window['scrollY'] = scrollY;
      expect(getScrolled(scrolled)).toBe(expected);
    });
  },
);

/*
 * Data Provider for getRenderedText
 * @param input
 * @param expected
 */
const dataGetRenderedText = [
  [{ rendered: 'Lorem ipsum dolor sit amet' }, 'Lorem ipsum dolor sit amet'],
  ['Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet'],
  [9999, 9999],
  [null, ''],
  [true, ''],
  [false, ''],
  [undefined, ''],
  [{ key: 'value' }, ''],
];

describe.each(dataGetRenderedText)(
  'getRenderedText()',
  (input, expected) => {
    test(`getRenderedText ${input}`, () => {
      expect(getRenderedText(input)).toBe(expected);
    });
  },
);

/*
 * Data Provider for parseJson
 * @param string
 * @param key
 * @param expected
 */
const dataParseJson = [
  ['{"key":"value"}', false, { key: 'value'}],
  ['{"key":"value"}', 'key', 'value'],
  ['Lorem ipsum dolor sit amet', false, null],
  [9999, false, null],
  [null, false, null],
  [true, false, null],
  [false, false, null],
  [undefined, false, null],
  [{ key: 'value' }, false, null],
];

describe.each(dataParseJson)(
  'dataParseJson()',
  (string, key, expected) => {
    test(`parseJson ${string}, ${key}`, () => {
      expect(parseJson(string, key)).toEqual(expected);
    });
  },
);

/*
 * Data Provider for parseDate
 * @param input
 * @param expected
 */
const dataParseDate = [
  ['2019-04-19 17:52:14', new Date(2019, 3, 19)],
  ['Lorem ipsum dolor sit amet', new Date()],
  [9999, new Date(9999)],
  [null, new Date()],
  [true, new Date()],
  [false, new Date()],
  [undefined, new Date()],
  [{ key: 'value' }, new Date()],
];

describe.each(dataParseDate)(
  'dataParseDate()',
  (input, expected) => {
    test(`parseDate ${input}`, () => {
      const expectedObject = {
        day: expected.getDate(),
        month: expected.toLocaleString('en-us', { month: 'short' }),
        year: expected.getFullYear(),
      };

      const actual = parseDate(input)
      delete actual.date;

      expect(actual).toEqual(expectedObject);
    });
  },
);

test('Mobile Browser Detection', () => {
  expect(isMobile()).toEqual(false);
});
