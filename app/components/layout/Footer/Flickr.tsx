/** app/components/layout/Footer/Flickr */

// Wordpress
const { compose } = wp.compose;
const { Component } = wp.element;

class Flickr extends Component {
  render(): JSX.Element {
    return (
      <div id="Flickr">
        <div className="row">
          {this.props.items.map((item) => (
            <div className="large-3 medium-4 small-3 columns" key={`flikr-${item.link}`}>
              <figure className="thumbnail">
                <a href={item.link} title={item.title} target="_blank" rel="noopener noreferrer">
                  <div className="zoom-icon" />
                  <div className="inner-shadow" />

                  <img src={item.media.s} alt={item.title} />
                </a>
              </figure>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default compose([])(Flickr);
