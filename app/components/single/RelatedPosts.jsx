import Item from 'app/components/archive/Item';

const { Component, Fragment } = wp.element;

class RelatedPosts extends Component {
  render() {
    const { items } = this.props;

    return (
      <Fragment>
        <header className="row">
          <div className="columns small-12">
            <h2 className="section-header"><span>Related Posts</span></h2>
          </div>
        </header>

        {items && (
          <section className="post-grid row">
            {items.map(related => (
              <Item
                item={related}
                key={`related--${related.id}`}
                columns="large-3 medium-6 small-12"
              />
            ))}
          </section>
        )}
      </Fragment>
    );
  }
}

export default RelatedPosts;
