import React, { Component } from 'react';
import { createBrowserHistory } from 'history';
import { STORE } from 'app/constants/common';

const { Fragment } = wp.element;
const { withDispatch } = wp.data;
const { compose } = wp.compose;

class Router extends Component {
  constructor(props) {
    super(props);
    this.changeLocation = this.changeLocation.bind(this);
    this.state = { location: '' };
  }

  componentDidMount() {
    const { setHistory } = this.props;
    const history = createBrowserHistory();
    this.setState({ location: history.location });
    setHistory(history);

    history.listen((location, action) => {
      if (action === 'PUSH') {
        this.changeLocation(location);
      }
    });
  }

  changeLocation(location) {
    this.setState({ location });
  }

  render() {
    const { children } = this.props;
    const { location } = this.state;

    const alterChildren = React.Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        index,
        location,
      });
    });

    return (
      <Fragment>
        {alterChildren}
      </Fragment>
    );
  }
}

const mapDispatchToProps = withDispatch((dispatch) => ({
  setHistory: (history) => dispatch(STORE).setHistory(history),
}));

export default compose([mapDispatchToProps])(Router);
