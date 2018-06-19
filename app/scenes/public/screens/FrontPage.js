import React, { Component, Fragment } from 'react';
import ReduxWrapper from 'src/ReduxWrapper';

import PageHeader from 'app/components/Layout/PageHeader';
import { getRandomImage } from 'app/utils/common';

import { resetMobileMenu } from 'app/actions/global';

const mapDispatchToProps = dispatch => ({
  resetMobileMenu: () => {
    dispatch(resetMobileMenu());
  },
});

class FrontPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      style: {
        backgroundImage: `url('${getRandomImage()}')`,
      },
    };
  }

  componentDidMount() {
    this.props.resetMobileMenu();
  }

  render() {
    const text = (
      <Fragment>
        <h1>SUJIN</h1>
        <p>Wordpress/React Developer</p>
      </Fragment>
    );

    return (
      <section className="template-front-page">
        <main className="page-wrapper">
          <PageHeader style={this.state.style} text={text} />
        </main>
      </section>
    );
  }
}

export default ReduxWrapper(null, mapDispatchToProps, FrontPage);
