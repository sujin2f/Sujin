import React, { Component } from 'react';

import Link from 'src/components/Link';

import SocialMedia from 'app/components/Common/SocialMedia';

class Copywrite extends Component {
  render() {
    return (
      <div id="copywrite">
        <div className="flex-container-row row">
          <div className="flex-container-row">
            <Link className="logo txt2image hide-for-small-only" href="/">Sujin</Link>
            <p id="copyline">Copyright &copy; 2017 sujinc.com</p>
          </div>
          <div>
            <SocialMedia position="bottom" />
          </div>
        </div>
      </div>
    );
  }
}

export default Copywrite;
