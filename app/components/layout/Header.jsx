import GlobalController from 'app/controllers/global';

import Link from 'app/components/router/Link';

import Menu from 'app/components/layout/Menu';
import Search from 'app/components/layout/Search';

const { Fragment, Component } = wp.element;

class Header extends Component {
  render() {
    return (
      <Fragment>
        {/* For Transparent Logo */}
        <section className="flex-row fixed-nav">
          <div className="section" />
          <div className="section center" />
          <div className="section" />
        </section>

        <section className="fixed-nav">
          <div className="row">
            <section className="columns small-6">
              <button
                className="hide-for-large icon hamburger"
                onClick={() => GlobalController.getInstance().setMobileMenu()}
                data-testid="hamburger"
                type="button"
                label="Toggle Menu"
              />
              <Menu
                id="primary-top"
                className="show-for-large"
                slug="main-menu"
              />
            </section>
            <section className="columns small-6 hide-for-small-only">
              <Search />

              <Menu
                id="social-media-top"
                className="show-for-large"
                slug="social-media"
              />
            </section>
          </div>
        </section>

        <section className="logo-container">
          <Link to="/" className="icon logo reverse">Sujin</Link>
        </section>

        <Menu
          id="primary-mobile"
          className="hide-for-large"
          slug="main-menu"
        />
      </Fragment>
    );
  }
}

export default Header;
