import React, { Component } from 'react';
import axios from 'axios';

import Header from 'app/components/layout/Header';
import { STORE } from 'app/constants/common';

const { withDispatch } = wp.data;
const { compose } = wp.compose;
const { Fragment } = wp.element;

class Public extends Component {
  componentDidMount() {
    const { getMenu } = this.props;
    getMenu();
  }

  render() {
    const { children } = this.props;

    return (
      <Fragment>
        <Header />
        {children}
      </Fragment>
    );
  }
}

const mapDispatchToProps = withDispatch((dispatch) => ({
  getMenu: () => {
    axios.get('/wp-json/sujin/v1/menu/main-menu')
      .then((response) => {
        dispatch(STORE).getMenuSuccess('main-menu', response);
      }).catch((error) => {
        dispatch(STORE).getMenuFail('main-menu', error);
      });

    axios.get('/wp-json/sujin/v1/menu/social-media')
      .then((response) => {
        dispatch(STORE).getMenuSuccess('social-media', response);
      }).catch((error) => {
        dispatch(STORE).getMenuFail('social-media', error);
      });
  },
}));

export default compose([mapDispatchToProps])(Public);
