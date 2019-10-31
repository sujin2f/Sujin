import IMAGE from '../../../assets/images/loading.svg';

const { Component } = wp.element;

class Loading extends Component {
  render() {
    return (
      <section>
        <img src={IMAGE} alt="Loading" />
      </section>
    );
  }
}

export default Loading;
