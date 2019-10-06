export default function preserveCase(input: string): Array<string> {
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
  return outputArr.filter(c => c);
}

export function camelCase(texts: Array<string>): string {
  const output = texts.map((text, index) => {
    if (index === 0) {
      return text.toLowerCase();
    }
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
  });

  return output.join('');
}

export function pascalCase(texts: Array<string>): string {
  const output = texts.map(text => `${text.charAt(0).toUpperCase()}${text.slice(1)}`);
  return output.join('');
}

export function pathCase(texts: Array<string>): string {
  const output = texts.map(text => text.toLowerCase());
  return output.join('/');
}

export function paramCase(texts: Array<string>): string {
  const output = texts.map(text => text.toLowerCase());
  return output.join('-');
}

export function snakeCase(texts: Array<string>): string {
  const output = texts.map(text => text.toLowerCase());
  return output.join('_');
}

export function constantCase(texts: Array<string>): string {
  const output = texts.map(text => text.toUpperCase());
  return output.join('_');
}

export function titleCase(texts: Array<string>): string {
  const output = texts.map(text => `${text.charAt(0).toUpperCase()}${text.slice(1)}`);
  return output.join(' ');
}

export function dotCase(texts: Array<string>): string {
  const output = texts.map(text => text.toLowerCase());
  return output.join('.');
}

export function sortText(text: string, removeEmpty: boolean): string {
  return text.split('\n').filter(l => (removeEmpty && l) || (!removeEmpty)).sort().join('\n');
}

export function symbolAlignment(text: string, symbol: string): string {
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
}
