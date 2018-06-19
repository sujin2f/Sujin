import React, { Component } from 'react';
import { withRouter } from 'react-router';

import PostContainer from 'app/components/PostContainer';
import GlobalFooter from 'app/components/Layout/GlobalFooter';

import { getPostServer, getPostSuccess, getPostFail } from 'app/actions/post';

class Post extends Component {
  static serverFetch(url) {
    const postSlug = url.split('/').filter(v => v).pop();

    return getPostServer(postSlug)
      .then(response => getPostSuccess(response))
      .catch(error => getPostFail(error));
  }

  render() {
    return (
      <section className="template-single">
        <main className="page-wrapper">
          <PostContainer push={this.props.history.push} params={this.props.match.params} />
        </main>

        <GlobalFooter />
      </section>
    );
  }
}

export default withRouter(Post);
