import ReduxWrapper from 'src/ReduxWrapper';

import { getMenu } from 'app/actions/global';

import Copywrite from './Copywrite';

const mapDispatchToProps = dispatch => ({
  getMenu: () => {
    dispatch(getMenu());
  },
});

export default ReduxWrapper(null, mapDispatchToProps, Copywrite);
