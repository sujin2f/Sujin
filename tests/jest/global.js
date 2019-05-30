global.wp = {
  shortcode: require('@wordpress/shortcode'),
  element: require('@wordpress/element'),
  data: require('@wordpress/data'),
  compose: require('@wordpress/compose'),
};

const STORE = require('../../app/constants/common').STORE;
const selectors = require('../../app/selectors');
const actions = require('../../app/actions');
const reducer = require('../../app/reducers');

wp.data.registerStore(STORE, { reducer, selectors, actions });
