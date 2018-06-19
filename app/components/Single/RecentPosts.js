import React, { Component, Fragment } from 'react';

import Loading from 'app/components/Common/Loading';
import ArchiveEntity from 'app/components/Archive/ArchiveEntity';

class RecentPosts extends Component {
  componentDidMount() {
    const {
      entities,
      cancelToken,
      getRecentPosts,
    } = this.props;

    if (entities.length === 0) {
      getRecentPosts(cancelToken);
    }
  }

  render() {
    const { entities, loading } = this.props;

    return (
      <Fragment>
        {loading &&
          <Loading />
        }
        {!loading && entities.map(entity => (
          <ArchiveEntity
            key={`post-id-${entity.id}`}
            id={`post-id-${entity.id}`}
            columns="large-12 medium-12 small-12"
            entity={entity}
          />
        ))}
      </Fragment>
    );
  }
}

export default RecentPosts;
