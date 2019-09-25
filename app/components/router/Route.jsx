import { getMatched } from 'app/utils/router';

import { STORE } from 'app/constants/common';

const { Fragment, Component } = wp.element;
const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;

class Route extends Component {
  render() {
    console.log('Route::render()');
    const {
      path,
      children,
      location,
      matched,
      setMatched,
    } = this.props;

    const newMatched = getMatched(path, location.pathname);

    if (matched && JSON.stringify(matched) !== JSON.stringify(newMatched.matched)) {
      return null;
    }

    if (newMatched.matched) {
      if (!matched) {
        setMatched(newMatched.matched);
      }

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
  matched: select(STORE).getMatched(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  setMatched: (matched) => dispatch(STORE).setMatched(matched),
}));

export default compose([mapStateToProps, mapDispatchToProps])(Route);
