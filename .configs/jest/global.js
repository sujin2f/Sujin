import React from 'react'
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

global.React = React;

global.wp = {
  shortcode: require('@wordpress/shortcode'),
  element: require('@wordpress/element'),
  compose: require('@wordpress/compose'),
  url: require('@wordpress/url'),
};

Enzyme.configure({ adapter: new Adapter() });

global.sujin = {};
