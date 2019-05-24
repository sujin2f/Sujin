// TODO React to wp for all Components
// Global classes to here, like moile munu/ detact

import Header from 'app/components/layout/Header';
import Footer from 'app/components/layout/Footer';

import { getScrolled } from 'app/utils/common';
import { STORE } from 'app/constants/common';

const { withSelect } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

class Public extends Component {
  constructor(props) {
    super(props);

    // Scrolled Control
    this.handleScroll = this.handleScroll.bind(this);
    this.state = { scrolled: '' };
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  // Scrolled Control
  handleScroll = () => {
    if (typeof window !== 'undefined') {
      const { scrolled: scrolledOrigin } = this.state;
      const scrolled = getScrolled(scrolledOrigin);

      if (scrolled === false) {
        return;
      }

      this.setState({ scrolled });
    }
  }

  render() {
    const {
      children,
      className = '',
      mobileMenuClass,
    } = this.props;
    const { scrolled } = this.state;

    return (
      <div id="wrapper" className={`${className} ${scrolled} ${mobileMenuClass}`}>
        <header itemType="http://schema.org/WPHeader">
          <Header />
        </header>

        <main>
          {children}
        </main>

        <footer>
          <Footer />
        </footer>
      </div>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  mobileMenuClass: select(STORE).getMobileMenuClass(),
}));

export default compose([mapStateToProps])(Public);
