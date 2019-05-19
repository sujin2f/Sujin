import React, { Component } from 'react';

import Menu from 'app/components/layout/Menu';

import { STORE } from 'app/constants/common';

const { withSelect } = wp.data;
const { compose } = wp.compose;

class PageHeader extends Component {
  render() {
    const {
      children,
      backgroundImage,
      mainMenu,
    } = this.props;

    return (
      <section className="page-header-wrapper">
        <div className="background" style={{ backgroundImage }} />
        <div className="foreground" />

        <div className="text">
          {children}
        </div>

        <div className="row">
          <section className="columns small-12">
            <Menu
              className="show-for-large menu-top"
              position="middle"
              menu={mainMenu}
            />
          </section>
        </div>
      </section>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  mainMenu: select(STORE).getMenu('main-menu'),
}));

export default compose([mapStateToProps])(PageHeader);
