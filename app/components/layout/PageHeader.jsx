// TODO animation https://codepen.io/ramon82/pen/opJXGr

import Menu from 'app/components/layout/Menu';
import { backgroundImageStyle } from 'app/utils/common';

const { Component } = wp.element;

class PageHeader extends Component {
  render() {
    const {
      children,
      backgroundImage,
    } = this.props;

    return (
      <header
        className="page-header-wrapper"
        style={backgroundImageStyle(backgroundImage)}
      >
        <div className="overlay">
          <div className="text row">
            {children}
          </div>

          <div className="row menu-container">
            <section className="columns small-12">
              <Menu
                id="primany-page-header"
                className="show-for-large flex-row"
                slug="main-menu"
              />
            </section>
          </div>
        </div>
      </header>
    );
  }
}

export default PageHeader;
