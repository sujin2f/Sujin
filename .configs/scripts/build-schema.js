const path = require('path');
const { compileFromFile } = require('json-schema-to-typescript');
const fs = require('fs');

fs.readdir(
  path.resolve(__dirname, '../', 'schema', 'response'),
  (_, files) => {
    // Per json
    files.forEach((file) => {
      const fileJson = path.resolve(__dirname, '../', 'schema', 'response', file);
      const fileTs = path.resolve(
        __dirname,
        '../',
        '../',
        'src',
        'store',
        'items',
        'schema',
        file.replace('.json', '.ts'),
      );
      compileFromFile(
        fileJson,
        {
          style: {
            singleQuote: true,
          },
        }
      )
      .then((ts) => fs.writeFileSync(fileTs, ts));
    });
  },
);
