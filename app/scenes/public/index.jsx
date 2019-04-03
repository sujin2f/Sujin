import React, { Component } from 'react';
import axios from 'axios';

import Header from 'app/components/layout/Header';
import Footer from 'app/components/layout/Footer';
import { STORE } from 'app/constants/common';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Fragment } = wp.element;

class Public extends Component {
  componentDidMount() {
    const {
      mainMenu,
      socialMedia,
      getMenu,
    } = this.props;

    if (mainMenu.length === 0) {
      getMenu('main-menu');
    }

    if (socialMedia.length === 0) {
      getMenu('social-media');
    }
  }

  render() {
    const { children } = this.props;

    return (
      <Fragment>
        <Header />
        {children}
        <Footer />
      </Fragment>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  mainMenu: select(STORE).getMenu('main-menu'),
  socialMedia: select(STORE).getMenu('social-media'),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  getMenu: (type) => {
    axios.get(`/wp-json/sujin/v1/menu/${type}`)
      .then((response) => {
        dispatch(STORE).getMenuSuccess(type, response);
      }).catch((error) => {
        dispatch(STORE).getMenuFail(type, error);
      });
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Public);
