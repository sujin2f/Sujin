import express from 'express';
import compression from 'compression';
import path from 'path';
import React from 'react';
import config from 'config';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Provider as ReduxProvider } from 'react-redux';
import Helmet from 'react-helmet';
import Prerender from 'prerender-node';

import routes from 'app/routes';
import App from 'src/components/App';
import Page from 'app/scenes/public/screens/Page';

import configureStore, { initializeSession } from './store';

import manifest from '../../../build/manifest.json';

const app = express();

app.use(compression());
app.use(express.static(path.resolve(__dirname, '../../../', process.env.npm_package_config_paths_output)));
app.use(Prerender);

app.get('/*', (req, res) => {
  const context = {};
  const { history, store } = configureStore();

  store.dispatch(initializeSession());

  const dataRequirements =
    routes.public
      .filter(route => route.path) // filter matching paths
      .filter(route => matchPath(req.url, route)) // filter matching paths
      .map(route => route.path === '/:pageSlug' ? Page : route.component) // map to components
      .filter(comp => comp ? comp.serverFetch : false) // check if components have data requirement
      .map(comp => comp.serverFetch(req.url)); // dispatch data requirement

  Promise.all(dataRequirements).then((result) => {
    if (result && result.length > 0) {
      store.dispatch(result.pop());
    }

    const jsx = (
      <ReduxProvider store={store}>
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      </ReduxProvider>
    );

    const reactDom = renderToString(jsx);
    const reduxState = store.getState();
    const helmetData = Helmet.renderStatic();

    res.writeHead(200, { 'Content-Type': 'text/html' });
    const html = htmlTemplate(reactDom, reduxState, helmetData);

    res.end(html);
  });
});
app.listen(8080);
console.log('Server listening on port 8080!');

function htmlTemplate(reactDom, reduxState, helmetData) {
  let vendor = '';
  if (manifest['vendor.js']) {
    vendor = `<script src="/${manifest['vendor.js']}"></script>`;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      ${helmetData.title.toString()}
      ${helmetData.base.toString()}
      ${helmetData.meta.toString()}
      ${helmetData.link.toString()}
      ${helmetData.script.toString()}

      <link rel="stylesheet" href="/${manifest['style.css']}" type="text/css" />
    </head>

    <body>
      <div id="app">${reactDom}</div>
      <script>
        window.REDUX_DATA = ${JSON.stringify(reduxState)}
      </script>
      ${vendor}
      <script src="/${manifest['app.js']}"></script>
    </body>
    </html>
  `;
}
