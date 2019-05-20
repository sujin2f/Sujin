import Link from 'app/components/router/Link';
import Menu from 'app/components/layout/Menu';

const { Component } = wp.element;

class Copywrite extends Component {
  render() {
    return (
      <div id="copywrite">
        <div className="flex-row row">
          <div className="flex-row columns medium-6 small-12">
            <Link to="/" className="icon logo hide-for-small-only">Sujin</Link>
            <p id="copyline">Copyright &copy; 2017 sujinc.com</p>
          </div>
          <Menu
            id="social-media-bottom"
            className="hide-for-small-only columns medium-6 small-12"
            slug="social-media"
          />
        </div>
      </div>
    );
  }
}

export default Copywrite;
