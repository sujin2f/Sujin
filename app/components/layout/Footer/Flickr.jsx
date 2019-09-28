import axios from 'axios';

import Loading from 'app/components/layout/Loading';

import { STORE } from 'app/constants/common';

const { withDispatch, withSelect } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

class Flickr extends Component {
  componentDidMount() {
    const { requestFlickr, flickr } = this.props;
    if (flickr.entities.length === 0 && flickr.error === false && flickr.loading === false) {
      requestFlickr();
    }
  }

  render() {
    const {
      flickr: {
        loading,
        error,
        entities,
      },
    } = this.props;

    if (loading) {
      return (<Loading />);
    }

    if (error) {
      return null;
    }

    return (
      <div id="Flickr">
        <h1>Photo Stream</h1>

        <div className="row">
          {entities.map(item => (
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
  requestFlickr: () => {
    dispatch(STORE).requestFlickrInit();

    axios.get('wp-json/sujin/v1/flickr/')
      .then((response) => {
        dispatch(STORE).requestFlickrSuccess(response);
      }).catch((error) => {
        dispatch(STORE).requestFlickrFail(error);
      });
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Flickr);
