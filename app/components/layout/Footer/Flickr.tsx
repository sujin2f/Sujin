import axios from 'axios';

import {
  default as FlickrType,
  FlickrArray,
} from 'app/types/responses/flickr';
import Loading from 'app/components/layout/Loading';
import { STORE } from 'app/constants/common';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

interface Props {
  // select
  flickr: FlickrArray;
  // dispatch
  requestFlickr: void;
};

class Flickr extends Component<Props> {
  componentDidMount() {
    const { requestFlickr, flickr } = this.props;
    if (typeof flickr === 'undefined') {
      requestFlickr();
    }
  }

  render() {
    const { flickr } = this.props;

    if (true === flickr) {
      return (<Loading />);
    }

    if (typeof flickr !== 'object') {
      return null;
    }

    return (
      <div id="Flickr">
        <h1><span>Photo Stream</span></h1>

        <div className="row">
          {flickr.map((item: FlickrType) => (
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

const mapDispatchToProps = withDispatch((dispatch) => ({
  requestFlickr: (): void => {
    dispatch(STORE).requestFlickrInit();

    axios.get('wp-json/sujin/v1/flickr/')
      .then((response) => {
        if (response.status === 204) {
          dispatch(STORE).requestFlickrFail();
          return;
        }

        dispatch(STORE).requestFlickrSuccess(response.data);
      }).catch(() => {
        dispatch(STORE).requestFlickrFail();
      });
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Flickr);
