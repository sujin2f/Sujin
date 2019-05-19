import React, { Component } from 'react';

import Link from 'app/components/router/Link';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchString: '',
      searchOpened: false,
    };

    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleKeyDownSearch = this.handleKeyDownSearch.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
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
    const { searchOpened, searchString } = this.state;
    if (!searchOpened || !searchString) {
      event.preventDefault();
      this.setState({
        searchOpened: !searchOpened,
      });

      setTimeout(() => document.getElementById('search-string').focus(), 300);
    } else {
      this.setState({ searchString: '' });
    }
  }

  render() {
    const { searchOpened, searchString } = this.state;
    const wrapperClass = searchOpened ? 'open' : '';

    return (
      <section id="search-container">
        <div className={`${wrapperClass}`}>
          <input
            type="text"
            id="search-string"
            value={searchString}
            onChange={this.handleChangeSearch}
            onKeyDown={this.handleKeyDownSearch}
          />
          <Link
            id="search-button"
            className="icon magnify"
            onClick={this.handleSubmitSearch}
            to={`/search/${searchString}`}
          />
        </div>
      </section>
    );
  }
}

export default Search;
