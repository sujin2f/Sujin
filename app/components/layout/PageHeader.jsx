import React, { Component } from 'react';

import Menu from 'app/components/layout/Menu';

class PageHeader extends Component {
  render() {
    const {
      children,
      backgroundImage,
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
              id="primany-page-header"
              className="show-for-large flex-row"
              slug="main-menu"
            />
          </section>
        </div>
      </section>
    );
  }
}

export default PageHeader;
