/// <reference path="../../../types/rest/flickr.d.ts" />

import axios from 'axios';

// Types
import * as FlickrTypes from 'Flickr';
import FlickrController from 'app/types/rest/flickr';

import Loading from 'app/components/layout/Loading';
import { STORE } from 'app/constants/common';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

interface Props {
  flickr: FlickrController;
};

// TODO forceUpdate
class Flickr extends Component<Props> {
  componentDidMount() {
    if (FlickrController.getInstance().isNotInitialized()) {
      FlickrController.getInstance().request();
    }
  }

  render() {
    const { flickr } = this.props;

    if (flickr.isLoading()) {
      return (<Loading />);
    }

    if (flickr.isNotInitialized()) {
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

const mapStateToProps = withSelect((select) => ({
  flickr: select(STORE).getFlickr(),
}));

export default compose([mapStateToProps])(Flickr);
