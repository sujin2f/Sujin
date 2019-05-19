import React, { Component } from 'react';

import Copywrite from 'app/components/layout/Footer/Copywrite';
import Flickr from 'app/components/layout/Footer/Flickr';

class GlobalFooter extends Component {
  componentDidMount() {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  render() {
    const { className } = this.props;

    return (
      <section id="footer" className={className}>
        <div className="row widget-area">
          <div className="small-12 medium-4 large-4 columns">
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-6757157308071440"
              data-ad-slot="6638219649"
              data-ad-format="auto"
            />
          </div>
          <div className="small-12 medium-4 large-4 columns">
            <Flickr />
          </div>
          <div className="small-12 medium-4 large-4 columns" />
        </div>
        <Copywrite />
      </section>
    );
  }
}

export default GlobalFooter;
