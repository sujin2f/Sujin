import React, { Component } from 'react';
import axios from 'axios';

import { STORE } from 'app/constants/common';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;

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

                  <img src={item.media.s} alt={item.title} />
                </a>
              </figure>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  entities: select(STORE).getFlickr(),
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  getFlickr: () => {
    dispatch(STORE).getFlickrInit();

    axios.get('wp-json/sujin/v1/flickr/')
      .then((response) => {
        dispatch(STORE).getFlickrSuccess(response);
      }).catch((error) => {
        dispatch(STORE).getFlickrFail(error);
      });
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Flickr);
