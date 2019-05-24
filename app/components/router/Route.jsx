import pathToRegexp from 'path-to-regexp';

const { Children, cloneElement, Component } = wp.element;

class Route extends Component {
  render() {
    const {
      path,
      location,
      children,
    } = this.props;

    const regExp = new RegExp(pathToRegexp(path));
    const matched = regExp.exec(location.pathname);

    if (matched) {
      const pathname = path.split('/')
        .filter(p => p.charAt(0) === ':')
        .map(p => p.slice(1).replace('?', ''));

      const match = pathname.reduce((acc, value, index) => ({
        ...acc,
        [value]: matched[index + 1],
      }), {});

      const alterChildren = Children.map(children, (child, index) => {
        return cloneElement(child, {
          index,
          match,
        });
      });
      return alterChildren;
    }

    return null;
  }
}

export default Route;
