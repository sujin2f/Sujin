import ReduxWrapper from 'src/ReduxWrapper';

import { getPage } from 'app/actions/page';
import { resetMobileMenu } from 'app/actions/global';

import Page from './Page';

const mapStateToProps = state => ({ ...state.page });

const mapDispatchToProps = dispatch => ({
  getPage: (params, push, token) => {
    dispatch(getPage(params, push, token));
  },
  resetMobileMenu: () => {
    dispatch(resetMobileMenu());
  },
});

export default ReduxWrapper(mapStateToProps, mapDispatchToProps, Page);
