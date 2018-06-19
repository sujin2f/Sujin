import React, { Component, Fragment } from 'react';
import ReduxWrapper from 'src/ReduxWrapper';

import PageHeader from 'app/components/Layout/PageHeader';
import { resetMobileMenu } from 'app/actions/global';

const mapDispatchToProps = dispatch => ({
  resetMobileMenu: () => {
    dispatch(resetMobileMenu());
  },
});

class NotFound extends Component {
  constructor(props) {
    super(props);

    this.state = {
      style: {
        backgroundImage: 'url("/images/background/404.jpg")',
      },
    };
  }

  componentDidMount() {
    this.props.resetMobileMenu();
  }

  render() {
    const text = (
      <Fragment>
        <h1>Page not Found</h1>
        <p>Something is wrong</p>
      </Fragment>
    );

    return (
      <section className="template-404">
        <main className="page-wrapper">
          <PageHeader style={this.state.style} text={text} />
        </main>
      </section>
    );
  }
}

export default ReduxWrapper(null, mapDispatchToProps, NotFound);
