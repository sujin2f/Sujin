import React, { Component } from 'react';

import { STORE } from 'app/constants/common';

const { withSelect } = wp.data;
const { compose } = wp.compose;

class Link extends Component {
  constructor(props) {
    super(props);
    this.pushHash = this.pushHash.bind(this);
  }

  pushHash = (e) => {
    const { to, history } = this.props;
    const origin = window.location.origin;
    history.push(to.replace(origin, ''));
    e.preventDefault();
  }

  render() {
    const { to, children } = this.props;

    return (
      <a href={to} onClick={(e) => this.pushHash(e)}>
        {children}
      </a>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  history: select(STORE).getHistory(),
}));

export default compose([mapStateToProps])(Link);
