import React, { Component } from 'react';

import Link from 'src/components/Link';

import MenuContainer from 'app/components/Common/MenuContainer';
import SocialMedia from 'app/components/Common/SocialMedia';

class GlobalHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      searchOpened: false,
    };

    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleKeyDownSearch = this.handleKeyDownSearch.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);

    this.props.getMenu();
  }

  handleChangeSearch(event) {
    this.setState({ searchString: event.target.value });
  }

  handleKeyDownSearch(event) {
    if (event.keyCode === 13) {
      document.getElementById('search-button').click();
    }
  }

  handleSubmitSearch(event) {
    if (!this.state.searchOpened || !this.state.searchString) {
      event.preventDefault();
      this.setState({
        searchOpened: !this.state.searchOpened,
      });

      setTimeout(() => document.getElementById('search-string').focus(), 300);
    } else {
      this.setState({ searchString: '' });
    }
  }

  render() {
    const { toggleMobileMenu, mobileMenuActivated } = this.props;

    return (
      <section
        id="global-header"
        itemType="http://schema.org/WPHeader"
        className={`${mobileMenuActivated ? 'show-mobile-menu' : ''}`}
        >
        <section className="floating-row">
          <div className="section left" />
          <div className="section center" />
          <div className="section right" />
        </section>

        <section className="floating-row">
          <div className="row">
            <section className="columns small-6 flex-container-row">
              <button
                id="btn-toggle-mobile"
                className="hide-for-large"
                onClick={toggleMobileMenu}
                >
                <span className="fa fa-bars" aria-hidden="true" />
              </button>
              <MenuContainer
                className="show-for-large flex-container-row menu-top"
                position="top"
              />
            </section>
            <section className="columns small-6 hide-for-small-only flex-container-row right">
              <section id="search-container" className="flex-container-row">
                <div className={`${this.state.searchOpened ? 'open' : ''} flex-container-row`}>
                  <input
                    type="text"
                    id="search-string"
                    value={this.state.searchString}
                    onChange={this.handleChangeSearch}
                    onKeyDown={this.handleKeyDownSearch}
                    />
                  <Link
                    id="search-button"
                    onClick={this.handleSubmitSearch}
                    href={`${process.env.SUJIN_BASE_URL}search/${this.state.searchString}`}
                    >
                    <span className="fa fa-search" aria-hidden="true" />
                  </Link>
                </div>
              </section>

              <SocialMedia className="show-for-large" position="top" />
            </section>
          </div>
        </section>

        <section className="logo">
          <Link href={`${process.env.SUJIN_BASE_URL}`} className="txt2image">Sujin</Link>
        </section>

        <section id="mobile-menu" className="hide-for-large">
          <MenuContainer position="mobile" />
        </section>
      </section>
    );
  }
}

export default GlobalHeader;
