import React, { Component } from 'react';
import { withRouter } from 'react-router';

import PageContainer from 'app/components/PageContainer';
import GlobalFooter from 'app/components/Layout/GlobalFooter';

import { getPageServer, getPageSuccess, getPageFail } from 'app/actions/page';

class Page extends Component {
  static serverFetch(url) {
    const pageSlug = url.split('/').filter(v => v).pop();

    return getPageServer(pageSlug)
      .then(response => getPageSuccess(response))
      .catch(error => getPageFail(error));
  }

  render() {
    return (
      <section className="template-page">
        <main className="page-wrapper">
          <PageContainer push={this.props.history.push} params={this.props.match.params} />
        </main>

        <GlobalFooter />
      </section>
    );
  }
}

export default withRouter(Page);
