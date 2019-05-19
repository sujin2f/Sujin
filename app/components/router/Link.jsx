import React, { Component } from 'react';

import { STORE } from 'app/constants/common';

const { withSelect } = wp.data;
const { compose } = wp.compose;

class Link extends Component {
  constructor(props) {
    super(props);
    this.pushHash = this.pushHash.bind(this);
  }

  pushHash = (e, target) => {
    if (target === '_blank') {
      return;
    }

    const { to, history } = this.props;
    const origin = window.location.origin;
    history.push(to.replace(origin, ''));
    e.preventDefault();
  }

  render() {
    const {
      to,
      children,
      className,
      target,
    } = this.props;

    return (
      <a
        href={to}
        onClick={(e) => this.pushHash(e, target)}
        className={className}
        target={target}
      >
        {children}
      </a>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  history: select(STORE).getHistory(),
}));

export default compose([mapStateToProps])(Link);
