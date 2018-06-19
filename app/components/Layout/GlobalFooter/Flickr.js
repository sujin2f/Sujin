import React, { Component } from 'react';

class Flickr extends Component {
  componentDidMount() {
    const { getFlickr, entities } = this.props;
    if (entities && entities.length === 0) {
      getFlickr();
    }
  }

  render() {
    const { entities } = this.props;

    return (
      <div id="Flickr">
        <h1>Photo Stream</h1>

        <div className="row">
          {entities && entities.map(item => (
            <div className="large-3 medium-2 small-3 columns" key={`flikr-${item.link}`}>
              <figure className="thumbnail">
                <a href={item.link} title={item.title} target="_blank" rel="noopener noreferrer">
                  <div className="zoom-icon" />
                  <div className="inner-shadow" />

                  <img src={item.media_s} alt={item.title} />
                </a>
              </figure>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Flickr;
