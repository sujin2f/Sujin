/// <reference path="../../../types/rest/flickr.d.ts" />

import axios from 'axios';

// Types
import * as FlickrTypes from 'Flickr';
import FlickrController from 'app/types/rest/flickr';

import Loading from 'app/components/layout/Loading';

const { Component } = wp.element;

class Flickr extends Component {
  componentDidMount() {
    const flickr = FlickrController.getInstance();
    if (!flickr.init) {
      flickr.request(this);
    }
  }

  render() {
    const flickr:FlickrController = FlickrController.getInstance();

    if (flickr.loading) {
      return (<Loading />);
    }

    if (!flickr.init) {
      return null;
    }

    if (flickr.failed) {
      return null;
    }

    return (
      <div id="Flickr">
        <h1><span>Photo Stream</span></h1>

        <div className="row">
          {flickr.entities.map((item: FlickrTypes.FlickrItem) => (
            <div className="large-3 medium-4 small-3 columns" key={`flikr-${item.link}`}>
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

export default Flickr;
