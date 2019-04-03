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
    } = this.props;
    const wrapperClass = mobileMenuActivated ? 'show-mobile-menu' : '';

    return (
      <section
        id="global-header"
        itemType="http://schema.org/WPHeader"
        className={wrapperClass}
      >
        {/* For Transparent Logo */}
        <section className="floating-row">
          <div className="section left" />
          <div className="section center" />
          <div className="section right" />
        </section>

        <section className="floating-row">
          <div className="row">
            <section className="columns small-6 flex-container-row">
              <button
                id="btn-toggle-mobile"
                className="hide-for-large"
                onClick={() => toggleMobileMenu()}
                type="button"
              >
                {/* TODO Hamberger */}
                <span className="fa fa-bars" aria-hidden="true" />
              </button>
              <Menu
                className="show-for-large flex-container-row menu-top"
                position="top"
                menu={mainMenu}
              />
            </section>
            <section className="columns small-6 hide-for-small-only flex-container-row right">
              <Search />

              {/* TODO Social Media */}
              <div className="show-for-large" position="top" />
            </section>
          </div>
        </section>

        <section className="logo">
          <Link to="/" className="txt2image">Sujin</Link>
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
