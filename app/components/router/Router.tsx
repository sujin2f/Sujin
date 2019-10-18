import MatchedItem from 'app/types/matched';
import RouteController from 'app/controllers/route';

const { Component } = wp.element;
const { compose } = wp.compose;

interface Props {
  // props
  children: Array<JSX.Element>;
}

interface State {
  mounted: boolean;
}

class Router extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { mounted: false };
    this.getValidChild = this.getValidChild.bind(this);
  }

  componentDidMount(): void {
    RouteController.getInstance();
    this.setState({ mounted: true });
  }

  getValidChild(): Array<JSX.Element> {
    const {
      children,
    } = this.props;

    let validChild = null;
    // Previous Matched
    const routeController = RouteController.getInstance();
    const matched = routeController.getMatched();
    children.some((child) => {
      const parsed: MatchedItem = routeController.parseMatched(child.props.path);

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
        routeController.setMatched(parsed);
      }

      validChild = child;
      validChild.props = {
        ...validChild.props,
        matched: parsed,
        componentHash: routeController.history.location.key,
      };
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

export default compose([])(Router);
