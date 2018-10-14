export default function preserveCase(input) {
  let output = '';
  let lastChar = '';

  for (let i = 0; i < input.length; i += 1) {
    const c = input[i];

    if (/[a-z0-9]/.test(c)) {
      output += c;
    } else if (/[A-Z]/.test(c)) {
      if (/[A-Z]/.test(lastChar)) {
        output += c;
      } else {
        output += `-${c}`;
      }
    } else {
      output += '-';
    }

    lastChar = c;
  }

  const outputArr = output.split('-');
  return outputArr.filter(c => c);
}

export function camelCase(texts) {
  const output = texts.map((text, index) => {
    if (index === 0) {
      return text.toLowerCase();
    }
    return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
  });

  return output.join('');
}

export function pascalCase(texts) {
  const output = texts.map(text => `${text.charAt(0).toUpperCase()}${text.slice(1)}`);
  return output.join('');
}

export function pathCase(texts) {
  const output = texts.map(text => text.toLowerCase());
  return output.join('/');
}

export function paramCase(texts) {
  const output = texts.map(text => text.toLowerCase());
  return output.join('-');
}

export function snakeCase(texts) {
  const output = texts.map(text => text.toLowerCase());
  return output.join('_');
}

export function constantCase(texts) {
  const output = texts.map(text => text.toUpperCase());
  return output.join('_');
}

export function titleCase(texts) {
  const output = texts.map(text => `${text.charAt(0).toUpperCase()}${text.slice(1)}`);
  return output.join(' ');
}

export function dotCase(texts) {
  const output = texts.map(text => text.toLowerCase());
  return output.join('.');
}

export function sortText(text) {
  return text.split('\n').sort().join('\n');
}
