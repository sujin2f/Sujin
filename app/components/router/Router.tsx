/*
 * Router
 */

import RouteController from 'app/controllers/route';

const { Component } = wp.element;
const { compose } = wp.compose;

interface Props {
  children: Array<JSX.Element>;
}
interface State {
  mounted: boolean;
}

class Router extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { mounted: false };
  }

  /*
   * Prep Controller and State
   */
  componentDidMount(): void {
    RouteController.getInstance(this);
    this.setState({ mounted: true });
  }

  render(): JSX.Element | Array<JSX.Element> {
    if (!this.state.mounted) {
      return null;
    }

    return RouteController.getInstance(this).filterChild(this.props.children);
  }
}

export default compose([])(Router);
