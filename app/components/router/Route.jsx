import { Component } from 'react';

class Route extends Component {
  render() {
    const { path, location, children } = this.props;

    if (path === location.pathname) {
      return children;
    }

    if (location.pathname) {
      const locations = location.pathname.split('/').filter(v => v);
      const paths = path.split('/').filter(v => v);

      if (locations.length === paths.length) {
        const matched = locations.reduce((acc, v, k) => {
          return v.match(paths[k]) && acc;
        }, true);

        if (matched) {
          return children;
        }
      }
    }

    return null;
  }
}

export default Route;
