import React, { Component } from 'react';

import Loading from 'app/components/Common/Loading';

import ArchiveEntity from 'app/components/Archive/ArchiveEntity';

class RelatedPosts extends Component {
  componentDidMount() {
    this.props.getRelatedPosts(this.props.postId, this.props.cancelToken);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.postId !== nextProps.postId) {
      const {
        getRelatedPosts,
        cancelToken,
      } = nextProps;

      getRelatedPosts(nextProps.postId, cancelToken);
    }
  }

  render() {
    const {
      entities,
      loading,
    } = this.props;

    return (
      <section id="related-posts">
        <header className="row">
          <div className="columns small-12">
            <h2 className="section-header">Related Posts</h2>
          </div>
        </header>

        {loading &&
          <Loading />
        }

        {!loading && entities &&
          <section className="post-grid row">
            {entities.map(entity => (
              <ArchiveEntity
                key={`related-post-id-${entity.id}`}
                id={`related-post-id-${entity.id}`}
                columns="large-3 medium-6 small-6"
                entity={entity}
              />
            ))}
          </section>
        }
      </section>
    );
  }
}

export default RelatedPosts;
