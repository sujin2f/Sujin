const { Fragment, Component } = wp.element;

class Content extends Component {
  render() {
    const { post } = this.props;

    console.log(post);

    return (
      <Fragment>
        Content
      </Fragment>
    );
  }
}

export default Content;
