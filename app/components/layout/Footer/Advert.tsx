/** app/components/layout/Footer/Advert */

declare global {
    interface Window {
      adsbygoogle;
    }
}

// Wordpress
const { compose } = wp.compose;
const { Component } = wp.element;

class Advert extends Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false };
  }

  shouldComponentUpdate(_, nextState): void {
    if (nextState.loaded) {
      return;
    }

    if (!this.refs.googleContainer.offsetWidth) {
      return;
    }

    this.setState({ loaded: true });

    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }

  render(): JSX.Element {
    return (
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={this.props.client}
        data-ad-slot={this.props.slot}
        data-ad-format="auto"
        data-full-width-responsive={this.props.responsive ? 'true' : 'false'}
        ref="googleContainer"
      />
    );
  }
}

export default compose([])(Advert);
