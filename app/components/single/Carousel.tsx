const { Component } = wp.element;
const { compose } = wp.compose;

interface Props {
  images: Array<string>;
}
interface State {
  currentImage: string;
}

class Carousel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { currentImage: 0 };
    this.changeImage = this.changeImage.bind(this);
    this.selectImage = this.selectImage.bind(this);
  }

  changeImage(add: number): void {
    const { images } = this.props;
    const { currentImage } = this.state;
    const index = currentImage + add;

    if (index < 0) {
      this.setState({ currentImage: images.length - 1 });
      return;
    }

    if (index >= images.length) {
      this.setState({ currentImage: 0 });
      return;
    }

    this.setState({ currentImage: index });
  }

  selectImage(index: number): void {
    this.setState({ currentImage: index });

    const { height, width, top } = this.refs[`picture-${index}`].getBoundingClientRect();

    const containerWidth = this.refs.current.getBoundingClientRect().width;
    const containerHeight = ((height * containerWidth) / width) - 10;

    this.refs.carousel.style.height = `${containerHeight}px`;
    this.refs.nav.scrollTop = top;
  }

  render(): JSX.Element {
    const { images } = this.props;
    const { currentImage } = this.state;

    return (
      <section className="carousel" ref="carousel">
        <section className="arrow-nav">
          <button
            className="prev"
            onClick={(): void => this.changeImage(-1)}
            type="button"
          >
            <i />
          </button>
          <div>
            {currentImage + 1}
            /
            {images.length}
          </div>
          <button
            className="next"
            onClick={(): void => this.changeImage(1)}
            type="button"
          >
            <i />
          </button>
        </section>
        <section className="picture-frame">
          <img src={images[currentImage]} alt="" ref="current" />
        </section>

        <section className="nav" ref="nav">
          <nav>
            {images.map((image, index) => {
              const className = image === images[currentImage] ? 'current' : '';
              return (
                <img
                  ref={`picture-${index}`}
                  src={image}
                  className={className}
                  alt=""
                  onClick={(): void => this.selectImage(index)}
                  onKeyDown={(): void => null}
                  role="presentation"
                />
              );
            })}
          </nav>
        </section>
      </section>
    );
  }
}

export default compose([])(Carousel);
