import GlobalController from 'app/controllers/global';

import Header from 'app/components/layout/Header';
import Footer from 'app/components/layout/Footer';

import { getScrolled } from 'app/utils/common';

const { Component } = wp.element;
const { compose } = wp.compose;

interface Props {
  // props
  className: string;
  children: Array<JSX.Element>;
}

interface State {
  scrolled: string;
}

class Public extends Component<Props, State> {
  constructor(public props: Props) {
    super(props);

    // Scrolled Control
    this.handleScroll = this.handleScroll.bind(this);
    this.state = { scrolled: '' };
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  // Scrolled Control
  handleScroll(): void {
    const { scrolled: scrolledOrigin } = this.state;
    const scrolled = getScrolled(scrolledOrigin);

    if (scrolled === false) {
      return;
    }

    this.setState({ scrolled });
  }

  render(): JSX.Element {
    const {
      children,
      className = '',
    } = this.props;
    const { scrolled } = this.state;
    const mobileMenu = GlobalController.getInstance().getMobileMenu();

    return (
      <div id="wrapper" className={`${className} ${scrolled} ${mobileMenu}`}>
        <header itemType="http://schema.org/WPHeader">
          <Header />
        </header>

        <main>
          {children}
        </main>

        <footer itemType="https://schema.org/WPFooter">
          <Footer />
        </footer>
      </div>
    );
  }
}

export default compose([])(Public);
