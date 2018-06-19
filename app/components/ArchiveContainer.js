import ReduxWrapper from 'src/ReduxWrapper';

import { getPosts } from 'app/actions/archive';
import { resetMobileMenu } from 'app/actions/global';

import Archive from './Archive';

const mapStateToProps = state => ({ ...state.archive });

const mapDispatchToProps = dispatch => ({
  getPosts: (params, push, token) => {
    dispatch(getPosts(params, push, token));
  },
  resetMobileMenu: () => {
    dispatch(resetMobileMenu());
  },
});

export default ReduxWrapper(mapStateToProps, mapDispatchToProps, Archive);
