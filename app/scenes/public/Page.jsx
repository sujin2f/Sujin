import React, { Component } from 'react';
import Link from 'app/components/router/Link';

class Page extends Component {
  render() {
    return (
      <div>
        Page:
        <Link to="/">home</Link>
      </div>
    );
  }
}

export default Page;
