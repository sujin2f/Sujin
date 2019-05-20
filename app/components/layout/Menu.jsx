import axios from 'axios';

import Link from 'app/components/router/Link';

import { STORE, IS_LOADING } from 'app/constants/common';

const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

class Menu extends Component {
  componentDidMount() {
    const {
      slug,
      getMenu,
      requestMenu,
    } = this.props;

    if (!getMenu(slug)) {
      requestMenu(slug);
    }
  }

  render() {
    const {
      getMenu,
      className = '',
      slug,
      id,
    } = this.props;

    const menuItems = getMenu(slug);

    if (menuItems === IS_LOADING || !menuItems) {
      return null;
    }

    return (
      <nav id={id} className={`${className} ${slug} menu`}>
        {menuItems.map(menuItem => (
          <Link
            to={menuItem.url}
            className={menuItem.classes.join(' ')}
            target={menuItem.target}
            itemType="http://schema.org/SiteNavigationElement"
            key={`menu-${slug}-${menuItem.id}`}
          >
            {menuItem.title}
          </Link>
        ))}
      </nav>
    );
  }
}

// Get
const mapStateToProps = withSelect((select) => ({
  /*
   * @param  string       slug
   * @return array|string IS_LOADING can be returned. WAIT!
   */
  getMenu: (slug) => {
    return select(STORE).getMenu(slug);
  },
}));

const mapDispatchToProps = withDispatch((dispatch) => ({
  requestMenu: (slug) => {
    dispatch(STORE).requestMenuInit(slug);

    axios.get(`/wp-json/sujin/v1/menu/${slug}`)
      .then((response) => {
        dispatch(STORE).requestMenuSuccess(slug, response);
      }).catch((error) => {
        dispatch(STORE).requestMenuFail(slug, error);
      });
  },
}));

export default compose([mapStateToProps, mapDispatchToProps])(Menu);
