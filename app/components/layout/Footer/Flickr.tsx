import FlickrController from 'app/controllers/rest/flickr';
import FlickrItem from 'app/types/rest/flickr';

const { Component } = wp.element;

class Flickr extends Component {
  render(): JSX.Element {
    const flickr = FlickrController.getInstance().addComponent(this).request();
    if (!flickr.init || flickr.loading || flickr.failed) {
      return null;
    }

    return (
      <div id="Flickr">
        <h1><span>Photo Stream</span></h1>

        <div className="row">
          {flickr.entities.map((item: FlickrItem) => (
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

export default Flickr;
