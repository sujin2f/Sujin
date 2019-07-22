global.wp = {
  shortcode: require('@wordpress/shortcode'),
  element: require('@wordpress/element'),
  data: require('@wordpress/data'),
  compose: require('@wordpress/compose'),
  url: require('@wordpress/url'),
};


const STORE = require('../../app/constants/common').STORE;
const actions = require('../../app/actions').default;
const reducer = require('../../app/reducers').default;
const selectors = require('../../app/selectors').default;

wp.data.registerStore(STORE, { reducer, selectors, actions });


