import Matched from 'app/types/matched';
import Matched from 'app/types/matched';

import { createBrowserHistory } from 'history';
import { STORE } from 'app/constants/common';
import { parseMatched } from 'app/utils/router';

const { Component } = wp.element;
const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;

interface Props {
  // dispatch
  setHistory(history: any): void;
  setLocation(location: any): void;
  setMatched(matched: Matched): void;
  // select
  location: any;
  matched: Matched;
  // props
  children: Array<JSX.Element>;
};

interface State {
  mounted: boolean;
};

class Router extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { mounted: false };
    this.setHistory = this.setHistory.bind(this);
    this.getValidChild = this.getValidChild.bind(this);
  }

  componentDidMount() {
    this.setHistory();
    this.setState({ mounted: true });
  }

  setHistory(): void {
    const {
      setHistory,
      setLocation,
      setMatched,
    } = this.props;

    // Set history
    const history = createBrowserHistory();

    setHistory(history);
    setLocation(history.location);

    history.listen((location, action: string) => {
      if (action === 'PUSH' || action === 'POP') {
        setHistory(history);
        setLocation(location);
        setMatched(new Matched({}));
      }
    });
  }

  getValidChild() {
    const {
      children,
      matched,
      location,
      setMatched,
    } = this.props;

    let validChild = null;

    children.some((child) => {
      if (!child.props.path) {
        validChild = child;
        return true;
      }

      const parsed = parseMatched(child.props.path, location.pathname);

      if (parsed.matched) {
        if (!matched) {
          setMatched(parsed.matched);
        }

        validChild = child;
        return true;
      }

      return false;
    });

    return [validChild];
  }

  render() {
    if (!this.state.mounted) {
      return null;
    }

    return this.getValidChild();
  }
}

const mapStateToProps = withSelect((select) => ({
  location: select(STORE).getLocation(),
  matched: select(STORE).getMatched(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  setHistory: (history: any): void => dispatch(STORE).setHistory(history),
  setLocation: (location: any): void => dispatch(STORE).setLocation(location),
  setMatched: (matched: Matched): void => dispatch(STORE).setMatched(matched),
}));

export default compose([mapStateToProps, mapDispatchToProps])(Router);
