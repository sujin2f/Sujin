import React, { Component } from 'react';
import { withRouter } from 'react-router';

import ArchiveContainer from 'app/components/ArchiveContainer';
import GlobalFooter from 'app/components/Layout/GlobalFooter';

import { getServerPosts, getPostsSuccess, getPostsFail } from 'app/actions/archive';

class Archive extends Component {
  static serverFetch(url) {
    const arrUrl = url.split('/').filter(v => v);

    const queryVars = {
      category: arrUrl[0] === 'category' ? arrUrl[1] : null,
      tag: arrUrl[0] === 'tag' ? arrUrl[1] : null,
      searchString: arrUrl[0] === 'search' ? arrUrl[1] : null,
      paged: arrUrl[3] || null,
    };

    return getServerPosts(queryVars)
      .then(response => getPostsSuccess(response))
      .catch(error => getPostsFail(error));
  }

  render() {
    return (
      <section className="template-archive">
        <main className="page-wrapper">
          <ArchiveContainer push={this.props.history.push} params={this.props.match.params} />
        </main>

        <GlobalFooter />
      </section>
    );
  }
}

export default withRouter(Archive);
