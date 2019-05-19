import React, { Component } from 'react';

import Link from 'app/components/router/Link';

import Menu from 'app/components/layout/Menu';
import Search from 'app/components/layout/Search';
// import SocialMedia from './SocialMedia';
import { STORE } from 'app/constants/common';

const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;

class Header extends Component {
  render() {
    const {
      toggleMobileMenu,
      mobileMenuActivated,
      mainMenu,
      socialMedia,
    } = this.props;
    const wrapperClass = mobileMenuActivated ? 'show-mobile-menu' : '';

    return (
      <section
        id="global-header"
        itemType="http://schema.org/WPHeader"
        className={wrapperClass}
      >
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
                onClick={() => toggleMobileMenu()}
                type="button"
              />
              <Menu
                className="show-for-large menu-top"
                position="top-main"
                menu={mainMenu}
              />
            </section>
            <section className="columns small-6 hide-for-small-only">
              <Search />

              <Menu
                className="show-for-large social-media"
                position="top-social"
                menu={socialMedia}
              />
            </section>
          </div>
        </section>

        <section className="logo-container">
          <Link to="/" className="icon logo reverse">Sujin</Link>
        </section>

        <section id="mobile-menu" className="hide-for-large">
          <Menu position="mobile" menu={mainMenu} />
        </section>
      </section>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  mobileMenuActivated: select(STORE).getMobileMenuActivated(),
  mainMenu: select(STORE).getMenu('main-menu'),
  socialMedia: select(STORE).getMenu('social-media'),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  toggleMobileMenu: () => dispatch(STORE).toggleMobileMenu(),
}));

export default compose([mapStateToProps, mapDispatchToProps])(Header);
