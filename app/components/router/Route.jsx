import { Component } from 'react';

class Route extends Component {
  render() {
    const { path, location, children } = this.props;

    if (path === location.pathname) {
      return children;
    }

    return null;
  }
}

export default Route;
