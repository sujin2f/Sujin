import { STORE } from 'app/constants/common';

import { scrollTo } from 'app/utils/common';

const { withSelect } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

class Link extends Component {
  constructor(props) {
    super(props);
    this.pushHash = this.pushHash.bind(this);
  }

  pushHash(e, target) {
    if (target === '_blank') {
      return;
    }

    const { to, history, location } = this.props;
    const origin = location.origin;
    history.push(to.replace(origin, ''));
    scrollTo();
    e.preventDefault();
  }

  render() {
    const {
      to,
      target,
      id,
      className,
      dangerouslySetInnerHTML,
      children,
      onClick = (e) => this.pushHash(e, target),
    } = this.props;

    return (
      <a
        href={to}
        onClick={onClick}
        target={target}
        id={id}
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
