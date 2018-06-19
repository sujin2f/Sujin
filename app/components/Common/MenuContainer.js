import ReduxWrapper from 'src/ReduxWrapper';

import Menu from './Menu';

const mapStateToProps = state => ({
  menu: state.global.menu,
});

export default ReduxWrapper(mapStateToProps, null, Menu);
