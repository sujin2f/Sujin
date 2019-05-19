import React, { Component } from 'react';
import axios from 'axios';

import Header from 'app/components/layout/Header';
import Footer from 'app/components/layout/Footer';
import { STORE } from 'app/constants/common';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;

class Public extends Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
    this.state = {
      scrolled: '',
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.handleScroll);
    }
  }

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

  handleScroll() {
    if (typeof window !== 'undefined') {
      const { scrolled } = this.state;

      if (window.scrollY > 80 && !scrolled) {
        this.setState({
          scrolled: 'scrolled',
        });
      }

      if (window.scrollY <= 80 && scrolled) {
        this.setState({
          scrolled: '',
        });
      }
    }
  }

  render() {
    const { children, footerClass } = this.props;
    const { scrolled } = this.state;

    return (
      <div className={scrolled}>
        <Header />
        {children}
        <Footer className={footerClass === 'front-page' ? 'hide' : ''} />
      </div>
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
