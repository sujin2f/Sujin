/** app/components/widgets/Advert */

// Wordpress
const { compose } = wp.compose;
const { Component } = wp.element;

class Tags extends Component {
  render(): JSX.Element {
    return (
      <section
        className="widget tag-cloud"
        dangerouslySetInnerHTML={{ __html: this.props.html }}
      />
    );
  }
}

export default compose([])(Tags);
