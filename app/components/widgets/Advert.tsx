/** app/components/widgets/Advert */

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
      return false;
    }

    if (!this.refs.googleContainer.offsetWidth) {
      return true;
    }

    if (!this.refs.googleContainer.offsetParent) {
      return true;
    }

    this.setState({ loaded: true });

    (window.adsbygoogle = window.adsbygoogle || []).push({});
    return true;
  }

  render(): JSX.Element {
    const {
      client,
      slot,
      responsive,
    } = this.props;

    if (!client || !slot) {
      return null;
    }

    return (
      <section className="widget google-advert">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive={responsive ? 'true' : 'false'}
          ref="googleContainer"
        />
      </section>
    );
  }
}

export default compose([])(Advert);
