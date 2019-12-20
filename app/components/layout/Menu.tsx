/** app/components/layout/Menu */

import { WithController } from 'app/scenes/WithController';

// Controller
import { IRestController } from 'app/controllers/rest';
import MenuController from 'app/controllers/rest/menu';

// Item
import { IMenu } from 'app/items/rest/interface/menu';

// Components
import Link from 'app/components/router/Link';

// Wordpress
const { compose } = wp.compose;
const { Fragment } = wp.element;

interface Props {
  id: string;
  slug: string;
  className?: string;
  menu: Array<IMenu>;
}

interface State {
  hover: {
    [id: number]: boolean;
  };
}

/*
 * Menu and menu items
 *
 * @todo Replace with CSS::hover
 */
class Menu extends WithController {
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

  public getController(): IRestController {
    const { slug } = this.props;
    return MenuController.getInstance(slug).addComponent(this);
  }

  render(): JSX.Element {
    this.request();
    const isPending = this.isPending();

    if (isPending) {
      return (<Fragment />);
    }

    const menu = this.getController();

    return (
      <nav
        id={this.props.id}
        className={`${this.props.className} ${this.props.slug} menu`}
      >
        {menu.entities.map((item: IMenu) => (
          <div
            onMouseOver={(): void => this.showChildren(item.ID)}
            onMouseLeave={(): void => this.hideChildren(item.ID)}
            onFocus={(): void => this.showChildren(item.ID)}
            onBlur={(): void => this.hideChildren(item.ID)}
            key={`menu-${item.ID}`}
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
                className={`children ${(this.state as State).hover[item.ID] ? '' : 'hide'}`}
              >
                {item.children.map((childItem: IMenu) => (
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
