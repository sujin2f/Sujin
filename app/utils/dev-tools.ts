/*
 * Make first letter to upper case
 */
const ucfirst = (text: string): string => `${text.charAt(0).toUpperCase()}${text.slice(1)}`;

/*
 * String to array
 */
export const preserveCase = (input: string): Array<string> => {
  let output = '';
  let lastChar = '';

  for (let i = 0; i < input.length; i += 1) {
    const c = input[i];

    if (/[a-z0-9]/.test(c)) {
      output += c.toLowerCase();
    } else if (/[A-Z]/.test(c)) {
      if (/[A-Z]/.test(lastChar)) {
        output += c.toLowerCase();
      } else {
        output += `-${c.toLowerCase()}`;
      }
    } else {
      output += '-';
    }

    lastChar = c;
  }

  const outputArr = output.split('-');
  return outputArr.filter((c) => c);
};

/*
 * camelCase
 */
export const camelCase = (texts: Array<string>): string => {
  const output = texts.map((text) => ucfirst(text));
  output[0] = output[0].toLowerCase();
  return output.join('');
};

/*
 * CONSTANT_CASE
 */
export const constantCase = (texts: Array<string>): string => texts.map((text) => text.toUpperCase()).join('_');

/*
 * dot.case
 */
export const dotCase = (texts: Array<string>): string => texts.map((text) => text.toLowerCase()).join('.');

/*
 * param-case
 */
export const paramCase = (texts: Array<string>): string => texts.map((text) => text.toLowerCase()).join('-');

/*
 * PascalCase
 */
export const pascalCase = (texts: Array<string>): string => texts.map((text) => ucfirst(text)).join('');

/*
 * path/case
 */
export const pathCase = (texts: Array<string>): string => texts.map((text) => text.toLowerCase()).join('/');

/*
 * snake_case
 */
export const snakeCase = (texts: Array<string>): string => texts.map((text) => text.toLowerCase()).join('_');

/*
 * Title Case
 */
export const titleCase = (texts: Array<string>): string => texts.map((text) => ucfirst(text)).join(' ');

export const sortText = (text: string, removeEmpty: boolean): string => text
  .split('\n')
  .filter((l) => (removeEmpty && l) || (!removeEmpty))
  .sort()
  .join('\n');

export const symbolAlignment = (text: string, symbol: string): string => {
  const lineInfo = [];
  const maxPosition = []; // this key is indent

  return text
    .split('\n')
    .map((line, lineNumber) => {
      lineInfo[lineNumber] = {
        indent: 0,
        symbol: null,
      };

      let indentFound = false;

      for (let i = 0; i < line.length; i += 1) {
        if (lineInfo[lineNumber].symbol === null) {
          // Calculate indent
          if (!indentFound) {
            if (line[i] === ' ' || line[i] === '\t') {
              lineInfo[lineNumber].indent += 1;
            } else {
              indentFound = true;
            }
          }

          // Symbol finder
          const compare = line.substring(i, i + symbol.length);
          if (compare === symbol && lineInfo[lineNumber].symbol === null) {
            lineInfo[lineNumber].symbol = i;
            if ((maxPosition[lineInfo[lineNumber].indent] || 0) < i) {
              maxPosition[lineInfo[lineNumber].indent] = i;
            }
          }
        }
      }

      return line;
    })
    .map((line, lineNumber) => {
      // Change the text
      if (!lineInfo[lineNumber].symbol) {
        return line;
      }

      const numSpaces = maxPosition[lineInfo[lineNumber].indent] - lineInfo[lineNumber].symbol;
      const spaces = Array(numSpaces).fill(' ').join('');
      const before = line.substring(0, lineInfo[lineNumber].symbol);
      const after = line.substring(lineInfo[lineNumber].symbol);
      return `${before}${spaces}${after}`;
    })
    .join('\n');
};
