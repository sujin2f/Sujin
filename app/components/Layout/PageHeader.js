import React, { Component } from 'react';

import MenuContainer from 'app/components/Common/MenuContainer';

class PageHeader extends Component {
  render() {
    const { style, text, background } = this.props;

    return (
      <section
        className={`page-header-wrapper ${background ? 'bg-size-contain' : ''}`}
        style={{ backgroundColor: background }}
        >
        <div className="background" style={style || {}} />
        <div className="foreground" />

        <div className="text">
          {text}
        </div>

        <div className="row">
          <section className="columns small-12">
            <MenuContainer className="hide-for-small-only flex-container-row" position="middle" />
          </section>
        </div>
      </section>
    );
  }
}

export default PageHeader;
