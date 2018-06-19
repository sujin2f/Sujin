import React, { Component } from 'react';

import SOCIAL_MEDIA from 'app/constants/menu';

class SocialMedia extends Component {
  render() {
    const { className, position } = this.props;

    return (
      <ul className={`${className} social-media flex-container-row`}>
        {Object.keys(SOCIAL_MEDIA).map(index => (
          <li key={`social-media-${position}-${index}`}>
            <a href={SOCIAL_MEDIA[index].url} target="_blank" rel="noopener noreferrer">
              <span className={`fa fa-${SOCIAL_MEDIA[index].icon}`} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    );
  }
}

export default SocialMedia;
