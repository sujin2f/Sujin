import { STORE } from 'app/constants/common';

const { withSelect } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

class Link extends Component {
  constructor(props) {
    super(props);
    this.pushHash = this.pushHash.bind(this);
  }

  pushHash = (e, target) => {
    if (target === '_blank') {
      return;
    }

    const { to, history, location } = this.props;
    const origin = location.origin;
    history.push(to.replace(origin, ''));
    e.preventDefault();
  }

  render() {
    const {
      to,
      target,
      className,
      dangerouslySetInnerHTML,
      children,
    } = this.props;

    return (
      <a
        href={to}
        onClick={(e) => this.pushHash(e, target)}
        target={target}
        className={className}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      >
        {children}
      </a>
    );
  }
}

const mapStateToProps = withSelect((select) => ({
  history: select(STORE).getHistory(),
  location: select(STORE).getLocation(),
}));

export default compose([mapStateToProps])(Link);
