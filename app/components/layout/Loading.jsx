import Image from '../../../assets/images/loading.svg';

const { Component } = wp.element;

class Loading extends Component {
  render() {
    return (
      <section>
        <img src={Image} alt="Loading" />
      </section>
    );
  }
}

export default Loading;
