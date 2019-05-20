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

      console.log(locations, paths);
      if (locations.length === paths.length) {
        const matched = locations.reduce((acc, v, k) => {
          console.log(v, paths[k]);
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
