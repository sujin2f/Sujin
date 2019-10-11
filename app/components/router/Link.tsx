import { STORE } from 'app/constants/common';

const { withSelect } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

interface Props {
  // select
  location;
  history;
  // props
  to: string;
  target: string;
  id: string;
  className: string;
  dangerouslySetInnerHTML: string;
  children: Array<JSX.Element>;
  onClick(e): void;
  onMouseOver(e): void;
  onMouseLeave(e): void;
  onFocus(e): void;
  onBlur(e): void;
}

class Link extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.pushHash = this.pushHash.bind(this);
  }

  pushHash(e, target: string): void {
    if (target === '_blank') {
      return;
    }

    const {
      to,
      history,
      location: {
        origin,
      },
    } = this.props;
    history.push(to.replace(origin, ''));
    e.preventDefault();
  }

  render(): JSX.Element {
    const {
      to,
      target,
      id,
      className,
      dangerouslySetInnerHTML,
      children,
      onClick = (e): void => this.pushHash(e, target),
      onMouseOver,
      onMouseLeave,
      onFocus,
      onBlur,
    } = this.props;

    return (
      <a
        href={to}
        onClick={onClick}
        target={target}
        id={id}
        className={className}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        onMouseOver={onMouseOver}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
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
