import MenuController, { MenuItem } from 'app/types/rest/menu';

import Link from 'app/components/router/Link';

const { Component } = wp.element;

interface Props {
  id: string;
  slug: string;
  className?: string;
};

interface State {
  hover: {
    [id: number]: boolean,
  };
};

class Menu extends Component<Props, State> {
  constructor(props:Props) {
    super(props);
    this.showChildren = this.showChildren.bind(this);
    this.hideChildren = this.hideChildren.bind(this);
    this.state = {
      hover: {},
    };
  }

  componentDidMount() {
    const menu: MenuController = MenuController.getInstance(this.props.slug);
    if (!menu.isInit()) {
      menu.request(this);
    }
  }

  showChildren(id: number): void {
    this.setState(prevState => ({
      hover: {
        ...prevState.hover,
        [id]: true,
      },
    }));
  }

  hideChildren(id: number): void {
    this.setState(prevState => ({
      hover: {
        ...prevState.hover,
        [id]: false,
      },
    }));
  }

  render() {
    const menu:MenuController = MenuController.getInstance(this.props.slug);

    if (menu.isLoading() || !menu.isInit() || menu.isFailed()) {
      return null;
    }

    const {
      className,
      slug,
      id,
    } = this.props;

    return (
      <nav
        id={this.props.id}
        className={`${this.props.className} ${this.props.slug} menu`}
      >
        {menu.getItems().map((item: MenuItem) => (
          <div
            onMouseOver={() => this.showChildren(item.ID)}
            onMouseLeave={() => this.hideChildren(item.ID)}
            onFocus={() => this.showChildren(item.ID)}
            onBlur={() => this.hideChildren(item.ID)}
          >
            <Link
              itemType="http://schema.org/SiteNavigationElement"
              to={item.url}
              className={item.classes.join(' ')}
              target={item.target}
              key={`menu-${item.ID}`}
            >
              {item.title}
            </Link>

            {item.children.length > 0 && (
              <nav
                id={`nav-child-${item.ID}`}
                className={`children ${this.state.hover[item.ID] ? '' : 'hide'}`}
              >
                {item.children.map((childItem: MenuItem) => (
                  <Link
                    target={childItem.target}
                    to={childItem.url}
                    className={childItem.classes.join(' ')}
                    itemType="http://schema.org/SiteNavigationElement"
                    key={`menu-${childItem.ID}`}
                  >
                    {childItem.title}
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

export default Menu;
