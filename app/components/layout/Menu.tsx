// Replace with CSS::hover
import MenuController from 'app/controllers/rest/menu';
import { default as MenuItem } from 'app/items/rest/menu';

import Link from 'app/components/router/Link';

const { Component } = wp.element;
const { compose } = wp.compose;

interface Props {
  id: string;
  slug: string;
  className?: string;
  menu: Array<MenuItem>;
}

interface State {
  hover: {
    [id: number]: boolean;
  };
}

class Menu extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.showChildren = this.showChildren.bind(this);
    this.hideChildren = this.hideChildren.bind(this);
    this.state = {
      hover: {},
    };
  }

  showChildren(id: number): void {
    this.setState((prevState: State) => ({
      hover: {
        ...prevState.hover,
        [id]: true,
      },
    }));
  }

  hideChildren(id: number): void {
    this.setState((prevState: State) => ({
      hover: {
        ...prevState.hover,
        [id]: false,
      },
    }));
  }

  render(): JSX.Element {
    const menu = MenuController.getInstance(this.props.slug).addComponent(this).request();
    if (!menu.init || menu.loading || menu.failed) {
      return null;
    }

    return (
      <nav
        id={this.props.id}
        className={`${this.props.className} ${this.props.slug} menu`}
      >
        {menu.entities.map((item: MenuItem) => (
          <div
            onMouseOver={(): void => this.showChildren(item.ID)}
            onMouseLeave={(): void => this.hideChildren(item.ID)}
            onFocus={(): void => this.showChildren(item.ID)}
            onBlur={(): void => this.hideChildren(item.ID)}
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

export default compose([])(Menu);
