import React, { Component } from 'react';

class Loading extends Component {
  render() {
    const imgLoading = '/images/loading.png';

    return (
      <section className="loading">
        <img src={imgLoading} role="presentation" alt="loading" />
        <span className="fa fa-cog fa-spin fa-3x fa-fw" />
      </section>
    );
  }
}

export default Loading;
