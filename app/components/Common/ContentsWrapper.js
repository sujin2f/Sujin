import React, { Component } from 'react';

class ContentsWrapper extends Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  handleScroll() {
    if (typeof window !== 'undefined') {
      const { scrolled, toggleScroll } = this.props;

      if (window.scrollY > 80 && scrolled === '') {
        toggleScroll('scrolled');
      }

      if (window.scrollY <= 80 && scrolled === 'scrolled') {
        toggleScroll('');
      }
    }
  }

  render() {
    const { scrolled } = this.props;

    return (
      <section className={scrolled}>
        {this.props.children}
      </section>
    );
  }
}

export default ContentsWrapper;
