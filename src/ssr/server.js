var config = require('config');

require('babel-register')({
  presets: ['env'],
  plugins: [
    ['module-resolver', {
      alias: {
        src: './src/ssr',
        app: './app',
      },
    }],
  ],
});

if (config.has('process.env.SUJIN_BASE_URL')) {
  process.env.SUJIN_BASE_URL = config.get('process.env.SUJIN_BASE_URL');
}
if (config.has('process.env.SUJIN_AJAX_URL')) {
  process.env.SUJIN_AJAX_URL = config.get('process.env.SUJIN_AJAX_URL');
}

require('./server/index');
