/* eslint-disable max-len */
import React, { Component } from 'react';

import DEFAULT_THUMBNAIL, { DEFAULT_OG_IMAGE } from 'app/constants/thumbnail';

class SocialShare extends Component {
  constructor(props) {
    super(props);
    this.openTwitter = this.openTwitter.bind(this);
    this.openFacebook = this.openFacebook.bind(this);
  }

  openTwitter(title) {
    window.open(
      `https://www.twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(window.location.href)}`,
      'Twitter',
      `toolbar=0,status=0,resizable=yes,width=500,height=600,top=${(window.innerHeight - 600) / 2},left=${(window.innerWidth - 500) / 2}`,
    );
  }

  openFacebook(title, excerpt, thumbnail) {
    let thumb = thumbnail !== DEFAULT_THUMBNAIL ? thumbnail : DEFAULT_OG_IMAGE;
    thumb = `http://sujinc.com${thumb}`;

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&picture=${encodeURIComponent(thumb)}&title=${encodeURIComponent(title)}&quote=${encodeURIComponent(excerpt)}`,
      'Facebook',
      `toolbar=0,status=0,resizable=yes,width=500,height=600,top=${(window.innerHeight - 600) / 2},left=${(window.innerWidth - 500) / 2}`,
    );
  }

  render() {
    const { title, excerpt, thumbnail } = this.props;

    return (
      <nav className="social-share">
        <button className="twitter" onClick={() => this.openTwitter(title)}>
          <span className="fa fa-twitter" aria-hidden="true" />
        </button>
        <button className="facebook" onClick={() => this.openFacebook(title, excerpt, thumbnail)}>
          <span className="fa fa-facebook" aria-hidden="true" />
        </button>
      </nav>
    );
  }
}

export default SocialShare;
/* eslint-enable max-len */
