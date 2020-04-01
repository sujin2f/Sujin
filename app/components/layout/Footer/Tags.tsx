/** app/components/layout/Footer/Advert */

// Wordpress
const { compose } = wp.compose;
const { Component } = wp.element;

class Tags extends Component {
  render(): JSX.Element {
    return (
      <section
        className="tag_cloud--container"
        dangerouslySetInnerHTML={{ __html: this.props.html }}
      />
    );
  }
}

export default compose([])(Tags);
