/** app/scenes/public */

// Controllers
import GlobalController from 'app/controllers/global';

// Components
import Header from 'app/components/layout/Header';
import Footer from 'app/components/layout/Footer';

// Wordpress
const { Component } = wp.element;

interface Props {
  // props
  className: string;
  children: Array<JSX.Element> | JSX.Element;
}

/*
 * Wrapper for the public pages
 */
export class Public extends Component<Props> {
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
      <div className={`layout__wrapper ${className} ${scrollClass} ${mobileMenuClass}`}>
        <header itemType="http://schema.org/WPHeader">
          <section className="layout__fixed-header">
            <Header />
          </section>
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
