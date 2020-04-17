/*
 * Single / Social Share Component
 * components/single/SocialShare
 */

import React from 'react';

import { shareTwitter, shareFacebook } from 'utils/single';

export class SocialShare extends React.Component {
  render() {
    const { title, excerpt, thumbnail } = this.props;

    return (
      <nav className="social-share">
        <button
          className="twitter"
          onClick={() => shareTwitter(title)}
          type="button"
          label="Share Twitter"
        />
        <button
          className="facebook"
          onClick={() => shareFacebook(title, excerpt, thumbnail)}
          type="button"
          label="Share Facebook"
        />
      </nav>
    );
  }
}
