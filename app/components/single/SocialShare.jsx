import { shareTwitter, shareFacebook } from 'app/utils/single';

const { Component } = wp.element;

class SocialShare extends Component {
  render() {
    const { title, excerpt, thumbnail } = this.props;

    return (
      <nav className="social-share">
        <button
          className="twitter"
          onClick={() => shareTwitter(title)}
          type="button"
        />
        <button
          className="facebook"
          onClick={() => shareFacebook(title, excerpt, thumbnail)}
          type="button"
        />
      </nav>
    );
  }
}

export default SocialShare;
