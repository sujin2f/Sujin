import React, { Component } from 'react';

import Link from 'app/components/router/Link';

import Menu from 'app/components/layout/Menu';
import Search from 'app/components/layout/Search';

import { STORE } from 'app/constants/common';

const { withDispatch } = wp.data;
const { compose } = wp.compose;
const { Fragment } = wp.element;

class Header extends Component {
  render() {
    const {
      setMobileMenu,
    } = this.props;

    return (
      <Fragment>
        {/* For Transparent Logo */}
        <section className="flex-row fixed-nav">
          <div className="section" />
          <div className="section center" />
          <div className="section" />
        </section>

        <section className="fixed-nav">
          <div className="row">
            <section className="columns small-6">
              <button
                className="hide-for-large icon hamburger"
                onClick={() => setMobileMenu()}
                type="button"
              />
              <Menu className="show-for-large" slug="main-menu" />
            </section>
            <section className="columns small-6 hide-for-small-only">
              <Search />

              <Menu className="show-for-large" slug="social-media" />
            </section>
          </div>
        </section>

        <section className="logo-container">
          <Link to="/" className="icon logo reverse">Sujin</Link>
        </section>

        <section id="mobile-menu" className="hide-for-large">
          <Menu slug="main-menu" />
        </section>
      </Fragment>
    );
  }
}

const mapDispatchToProps = withDispatch((dispatch) => ({
  setMobileMenu: () => dispatch(STORE).setMobileMenu('toggle'),
}));

export default compose([mapDispatchToProps])(Header);
