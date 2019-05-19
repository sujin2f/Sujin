import React, { Component } from 'react';
import Link from 'app/components/router/Link';

class FrontPage extends Component {
  render() {
    return (
      <section className="page-wrapper">
        Page:
        <Link to="/app">app</Link>
      </section>
    );
  }
}

export default FrontPage;
