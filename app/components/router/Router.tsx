import { createBrowserHistory } from 'history';
import { empty, MatchedController } from 'app/types/matched';
import { STORE } from 'app/constants/common';
import { scrollTo } from 'app/utils/common';

const { Component } = wp.element;
const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;

interface Props {
  // dispatch
  setHistory(history): void;
  setLocation(location): void;
  setMobileMenuFalse(): void;
  // select
  location;
  // props
  children: Array<JSX.Element>;
}

interface State {
  mounted: boolean;
}

class Router extends Component<Props, State> {
  constructor(props: Props) {
    console.log('constructor');
    super(props);
    this.state = { mounted: false };
    this.setHistory = this.setHistory.bind(this);
    this.getValidChild = this.getValidChild.bind(this);
  }

  componentDidMount(): void {
    console.log('componentDidMount');
    this.setHistory();
    this.setState({ mounted: true });
  }

  setHistory(): void {
    console.log('setHistory');
    const {
      setHistory,
      setLocation,
      // setMatched,
      setMobileMenuFalse,
    } = this.props;

    // Set history
    const history = createBrowserHistory();

    setHistory(history);
    setLocation(history.location);

    history.listen((location, action: string) => {
      if (action === 'PUSH' || action === 'POP') {
        scrollTo();
        setMobileMenuFalse();
        setHistory(history);
        setLocation(location);
        MatchedController.getInstance().setMatched(empty);
      }
    });
  }

  getValidChild(): Array<JSX.Element> {
    console.log('getValidChild');
    const {
      children,
      location,
      // setMatched,
    } = this.props;

    let validChild = null;
    const matched = MatchedController.getInstance().getMatched() || empty;
    console.log(matched);

    children.some((child) => {
      const parsed = MatchedController.parseMatched(child.props.path, location.pathname);
      console.log(parsed);

      if (!parsed.matched) {
        return false;
      }

      if (!child.props.path) {
        validChild = child;
        return true;
      }

      if (!matched.matched) {
        MatchedController.getInstance().setMatched(parsed);
      }

      validChild = child;
      return true;
    });

    return [validChild];
  }

  render(): JSX.Element | Array<JSX.Element> {
    if (!this.state.mounted) {
      return null;
    }

    return this.getValidChild();
  }
}

const mapStateToProps = withSelect((select) => ({
  location: select(STORE).getLocation(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  setHistory: (history): void => dispatch(STORE).setHistory(history),
  setLocation: (location): void => dispatch(STORE).setLocation(location),
  setMobileMenuFalse: (): void => dispatch(STORE).setMobileMenu(false),
}));

export default compose([mapStateToProps, mapDispatchToProps])(Router);
