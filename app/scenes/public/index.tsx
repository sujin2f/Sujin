import GlobalController from 'app/controllers/global';

import Header from 'app/components/layout/Header';
import Footer from 'app/components/layout/Footer';

const { Component } = wp.element;
const { compose } = wp.compose;

interface Props {
  // props
  className: string;
  children: Array<JSX.Element>;
}

class Public extends Component<Props> {
  constructor(public props: Props) {
    super(props);
    GlobalController.getInstance(this).setScroll();
  }

  render(): JSX.Element {
    const {
      children,
      className,
    } = this.props;
    const { scrollClass, mobileMenuClass } = GlobalController.getInstance(this);

    return (
      <div id="wrapper" className={`${className} ${scrollClass} ${mobileMenuClass}`}>
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
