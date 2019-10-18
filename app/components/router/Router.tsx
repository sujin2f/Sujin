import hash from 'object-hash';

import { createBrowserHistory } from 'history';
import MatchedController, { MatchedItem } from 'app/types/matched';
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

const mapStateToProps = withSelect((select) => ({
  location: select(STORE).getLocation(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  setHistory: (history): void => dispatch(STORE).setHistory(history),
  setLocation: (location): void => dispatch(STORE).setLocation(location),
  setMobileMenuFalse: (): void => dispatch(STORE).setMobileMenu(false),
}));

class Router extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { mounted: false };
    this.getValidChild = this.getValidChild.bind(this);
    this.prepareHistory = this.prepareHistory.bind(this);
  }

  componentDidMount(): void {
    this.prepareHistory();
    this.setState({ mounted: true });
  }

  getValidChild(): Array<JSX.Element> {
    const {
      children,
      location,
      // setMatched,
    } = this.props;

    let validChild = null;
    // Previous Matched
    const matched = MatchedController.getInstance().getMatched();
    children.some((child) => {
      const parsed: MatchedItem = MatchedController.parseMatched(child.props.path, location.pathname);

      // Not Matched -- maybe the next one
      if (!parsed.matched) {
        return false;
      }

      // Not Matched (404)
      if (!child.props.path) {
        validChild = child;
        return true;
      }

      // matched was not yet set
      if (!matched.matched) {
        MatchedController.getInstance().setMatched(parsed);
      }

      console.log(parsed);

      validChild = child;
      validChild.props = {
        ...validChild.props,
        matched: parsed,
        componentHash: hash(new Date().getTime()),
      };
      return true;
    });

    return [validChild];
  }

  prepareHistory(): void {
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
        MatchedController.getInstance().setMatched();
      }
    });
  }

  render(): JSX.Element | Array<JSX.Element> {
    if (!this.state.mounted) {
      return null;
    }

    return this.getValidChild();
  }
}

export default compose([mapStateToProps, mapDispatchToProps])(Router);
