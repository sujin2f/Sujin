import React, { Component } from 'react';

import Link from 'app/components/router/Link';

class Copywrite extends Component {
  render() {
    return (
      <div id="copywrite">
        <div className="flex-container-row row">
          <div className="flex-container-row">
            <Link className="logo txt2image hide-for-small-only" to="/">Sujin</Link>
            <p id="copyline">Copyright &copy; 2017 sujinc.com</p>
          </div>
          <div>
            {/* TODO Social Media */}
            Social Media
          </div>
        </div>
      </div>
    );
  }
}

export default Copywrite;
