import React, { Component } from 'react';
import { Link as ReactLink } from 'react-router-dom';

class Link extends Component {
  render() {
    return (
      <ReactLink
        to={this.props.href}
        id={this.props.id}
        className={this.props.className}
        rel={this.props.rel}
        target={this.props.target}
        title={this.props.title}
        dangerouslySetInnerHTML={this.props.dangerouslySetInnerHTML}
      >
        {this.props.children}
      </ReactLink>
    );
  }
}

export default Link;
