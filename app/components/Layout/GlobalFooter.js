import React, { Component } from 'react';

import CopywriteContainer from 'app/components/Layout/GlobalFooter/CopywriteContainer';
import FlickrContainer from 'app/components/Layout/GlobalFooter/FlickrContainer';

class GlobalFooter extends Component {
  componentDidMount() {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  render() {
    return (
      <section id="footer">
        <div className="row widget-area">
          <div className="small-12 medium-4 large-4 columns">
            <ins className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-6757157308071440"
              data-ad-slot="6638219649"
              data-ad-format="auto"
              />
          </div>
          <div className="small-12 medium-4 large-4 columns">
            <FlickrContainer />
          </div>
          <div className="small-12 medium-4 large-4 columns" />
        </div>
        <CopywriteContainer />
      </section>
    );
  }
}

export default GlobalFooter;
