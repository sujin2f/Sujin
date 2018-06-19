import ReduxWrapper from 'src/ReduxWrapper';

import { getFlickr } from 'app/actions/flickr';

import Flickr from './Flickr';

const mapStateToProps = state => ({
  entities: state.flickr.entities || [],
});

const mapDispatchToProps = dispatch => ({
  getFlickr: () => {
    dispatch(getFlickr());
  },
});

export default ReduxWrapper(mapStateToProps, mapDispatchToProps, Flickr);
