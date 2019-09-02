import { createBrowserHistory } from 'history';
import { STORE } from 'app/constants/common';

const { Fragment, Component } = wp.element;
const { withDispatch } = wp.data;
const { compose } = wp.compose;

class Router extends Component {
  componentDidMount() {
    const {
      setHistory,
      setLocation,
      setMatched,
    } = this.props;

    const history = createBrowserHistory();
    setHistory(history);
    setLocation(history.location);

    history.listen((location, action) => {
      if (action === 'PUSH' || action === 'POP') {
        setHistory(history);
        setLocation(location);
        setMatched({});
      }
    });
  }

  render() {
    const { children } = this.props;
    console.log(children);
    return (
      <Fragment>
        {children}
      </Fragment>
    );
  }
}

const mapDispatchToProps = withDispatch((dispatch) => ({
  setHistory: (history) => dispatch(STORE).setHistory(history),
  setLocation: (location) => dispatch(STORE).setLocation(location),
  setMatched: (matched) => dispatch(STORE).setMatched(matched),
}));

export default compose([mapDispatchToProps])(Router);
