import { STORE } from 'app/constants/common';

const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;
const { Component } = wp.element;

interface Props {
  // select
  location: any;
  history: any;
  // props
  to: string;
  target: string;
  id: string;
  className: string;
  dangerouslySetInnerHTML: string;
  children: Array<JSX.Element>;
  onClick(e: any): void;
  onMouseOver(e: any): void;
  onMouseLeave(e: any): void;
  onFocus(e: any): void;
  onBlur(e: any): void;
};

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
      location,
    } = this.props;
    const origin = location.origin;
    history.push(to.replace(origin, ''));
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
