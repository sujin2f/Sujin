const { Component } = wp.element;
const { compose } = wp.compose;

interface Props {
  images: Array<string>;
}
interface State {
  currentImage: string;
}

class Carousel extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentImage: props.images[0],
    };
  }

  render(): JSX.Element {
    const { images } = this.props;
    const { currentImage } = this.state;

    console.log(images);

    return (
      <section className="carousel">
        <section>
          <img src={currentImage} alt="" />
        </section>
        <nav>
          {images.map((image) => {
            const className = image === currentImage ? 'current' : '';
            return (<img src={image} className={className} alt="" />);
          })}
        </nav>
      </section>
    );
  }
}

export default compose([])(Carousel);
