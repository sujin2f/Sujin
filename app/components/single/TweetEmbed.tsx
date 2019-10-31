const { Component } = wp.element;
const { compose } = wp.compose;

declare global {
  interface Window {
    twttr;
  }
}

const callbacks = [];

interface Props {
  id: string;
  options?: object;
  placeholder?: string | JSX.Element;
  protocol?: string;
  className?: string;
}

interface State {
  isLoading: boolean;
}

class TweetEmbed extends Component<Props, State> {
  div?: HTMLDivElement;

  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: true,
    };

    this.loadTweetForProps = this.loadTweetForProps.bind(this);
    this.addScript = this.addScript.bind(this);
  }

  componentDidMount(): void {
    this.loadTweetForProps(this.props);
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    return (
      this.props.id !== nextProps.id ||
      this.props.className !== nextProps.className
    );
  }

  /* eslint-disable react/no-deprecated */
  componentWillUpdate(nextProps: Props): void {
    if (this.props.id !== nextProps.id) {
      this.loadTweetForProps(nextProps);
    }
  }
  /* eslint-enable */

  loadTweetForProps(props: Props): void {
    const renderTweet = (): void => {
      const { twttr } = window;
      twttr.ready().then(({ widgets }) => {
        // Clear previously rendered tweet before rendering the updated tweet id
        if (this.div) {
          this.div.innerHTML = '';
        }

        const { options = {} } = props;
        widgets
          .createTweetEmbed(this.props.id, this.div, options)
          .then(() => {
            this.setState({
              isLoading: false,
            });
          });
      });
    };

    const { twttr } = window;
    if (!(twttr && twttr.ready)) {
      let protocol = this.props.protocol || 'https:';
      const isLocal = window.location.protocol.indexOf('file') >= 0;
      protocol = isLocal ? protocol : '';

      this.addScript(`${protocol}//platform.twitter.com/widgets.js`, renderTweet);
    } else {
      renderTweet();
    }
  }

  addScript(src: string, cb: () => void): void {
    if (!callbacks.length) {
      callbacks.push(cb);
      const s = document.createElement('script');
      s.setAttribute('src', src);
      s.onload = (): void => callbacks.forEach((d) => d());
      document.body.appendChild(s);
    } else {
      callbacks.push(cb);
    }
  }

  render(): JSX.Element {
    const { className, placeholder } = this.props;
    const { isLoading } = this.state;

    return (
      <div
        className={className}
        ref={(c): void => {
          this.div = c;
        }}
      >
        {isLoading && placeholder}
      </div>
    );
  }
}

export default compose([])(TweetEmbed);
