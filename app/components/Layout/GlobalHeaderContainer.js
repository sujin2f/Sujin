import ReduxWrapper from 'src/ReduxWrapper';

import {
  toggleMobileMenu,
  getMenu,
} from 'app/actions/global';

import GlobalHeader from './GlobalHeader';

const mapStateToProps = state => ({
  mobileMenuActivated: state.global.mobileMenu,
});

const mapDispatchToProps = dispatch => ({
  toggleMobileMenu: () => {
    dispatch(toggleMobileMenu());
  },
  getMenu: () => {
    dispatch(getMenu());
  },
});

export default ReduxWrapper(mapStateToProps, mapDispatchToProps, GlobalHeader);
