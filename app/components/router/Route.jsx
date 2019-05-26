import pathToRegexp from 'path-to-regexp';

import { STORE } from 'app/constants/common';

const { Fragment, Component } = wp.element;
const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;

class Route extends Component {
  render() {
    const {
      path,
      children,
      location,
      setMatched,
    } = this.props;

    const regExp = new RegExp(pathToRegexp(path));
    const matched = regExp.exec(location.pathname);

    if (matched) {
      const pathname = path.split('/')
        .filter(p => p.charAt(0) === ':')
        .map(p => p.slice(1).replace(/\?|(\(.+\))/, ''));

      const newMatched = pathname.reduce((acc, value, index) => ({
        ...acc,
        [value]: matched[index + 1],
      }), { matched: true });

      setMatched(newMatched);

      return (
        <Fragment>
          {children}
        </Fragment>
      );
    }

    return null;
  }
}

const mapStateToProps = withSelect((select) => ({
  location: select(STORE).getLocation(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  setMatched: (matched) => dispatch(STORE).setMatched(matched),
}));

export default compose([mapStateToProps, mapDispatchToProps])(Route);
