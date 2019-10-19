import RouteController from 'app/controllers/route';

const { compose } = wp.compose;
const { Component } = wp.element;

interface Props {
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
  render(): JSX.Element {
    const { to, target } = this.props;
    const {
      id,
      className,
      dangerouslySetInnerHTML,
      children,
      onClick = (e): void => RouteController.getInstance().pushHash(e, to, target),
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

export default compose([])(Link);
