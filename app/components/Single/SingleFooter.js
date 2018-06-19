import React, { Component } from 'react';

import PrevNext from 'app/components/Single/SingleFooter/PrevNext';
import RelatedPostsContainer from 'app/components/Single/SingleFooter/RelatedPostsContainer';

class SingleFooter extends Component {
  render() {
    return (
      <aside id="single-footer">
        <PrevNext prevnext={this.props.prevnext} />
        <RelatedPostsContainer postId={this.props.postId} />
      </aside>
    );
  }
}

export default SingleFooter;
