import React, { Component } from 'react';
import Link from 'app/components/router/Link';

class FrontPage extends Component {
  render() {
    return (
      <div>
        Page:
        <Link to="/app">app</Link>
      </div>
    );
  }
}

export default FrontPage;
