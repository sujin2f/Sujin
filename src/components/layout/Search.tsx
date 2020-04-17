import React from 'react';
import { useHistory } from "react-router-dom";

export class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchOpened: false,
      searchString: '',
    };

    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleKeyDownSearch = this.handleKeyDownSearch.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
  }

  handleChangeSearch(event): void {
    this.setState({ searchString: event.target.value });
  }

  handleKeyDownSearch(e): void {
    if (e.keyCode === 13) {
      this.handleSubmitSearch(e);
    }
  }

  handleSubmitSearch(e): void {
    const { searchOpened, searchString } = this.state;

    if (!searchOpened || !searchString) {
      this.setState({
        searchOpened: !searchOpened,
      });

      setTimeout(() => document.getElementById('search-string').focus(), 300);
    } else if (searchString) {
      const to = `/search/${searchString}`;
      const history = useHistory();
      history.push(to);
      this.setState({
        searchString: '',
      });
    }

    e.preventDefault();
  }

  render(): JSX.Element {
    const { searchOpened, searchString } = this.state;
    const wrapperClass = searchOpened ? 'open' : '';

    return (
      <section id="search-container" className={`${wrapperClass}`}>
        <input
          type="text"
          id="search-string"
          value={searchString}
          onChange={this.handleChangeSearch}
          onKeyDown={this.handleKeyDownSearch}
        />
        <button
          id="search-button"
          className="icon magnify"
          onClick={this.handleSubmitSearch}
          type="submit"
        />
      </section>
    );
  }
}
