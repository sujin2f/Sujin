import axios from 'axios';

import Link from 'app/components/router/Link';

import { STORE, IS_LOADING } from 'app/constants/common';

const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

class Menu extends Component {
  constructor(props) {
    super(props);
    this.showChildren = this.showChildren.bind(this);
    this.hideChildren = this.hideChildren.bind(this);
    this.state = {
      hover: {},
    };
  }

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

  showChildren(id) {
    this.setState(prevState => ({
      hover: {
        ...prevState.hover,
        [id]: true,
      },
    }));
  }

  hideChildren(id) {
    this.setState(prevState => ({
      hover: {
        ...prevState.hover,
        [id]: false,
      },
    }));
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
          <div
            onMouseOver={() => this.showChildren(menuItem.ID)}
            onMouseLeave={() => this.hideChildren(menuItem.ID)}
            onFocus={() => this.showChildren(menuItem.ID)}
            onBlur={() => this.hideChildren(menuItem.ID)}
          >
            <Link
              to={menuItem.url}
              className={menuItem.classes.join(' ')}
              target={menuItem.target}
              itemType="http://schema.org/SiteNavigationElement"
              key={`menu-${slug}-${menuItem.ID}`}
            >
              {menuItem.title}
            </Link>

            {menuItem.children.length > 0 && (
              <nav
                id={`nav-child-${menuItem.ID}`}
                className={`children ${this.state.hover[menuItem.ID] ? '' : 'hide'}`}
              >
                {menuItem.children.map(menuChild => (
                  <Link
                    to={menuChild.url}
                    className={menuChild.classes.join(' ')}
                    target={menuChild.target}
                    itemType="http://schema.org/SiteNavigationElement"
                    key={`menu-${slug}-${menuChild.ID}`}
                  >
                    {menuChild.title}
                  </Link>
                ))}
              </nav>
            )}
          </div>
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
