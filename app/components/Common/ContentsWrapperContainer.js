import ReduxWrapper from 'src/ReduxWrapper';

import { toggleScroll } from 'app/actions/global';

import ContentsWrapper from './ContentsWrapper';

const mapStateToProps = state => ({
  scrolled: state.global.scrolled,
});

const mapDispatchToProps = dispatch => ({
  toggleScroll: (key) => {
    dispatch(toggleScroll(key));
  },
});

export default ReduxWrapper(mapStateToProps, mapDispatchToProps, ContentsWrapper);
