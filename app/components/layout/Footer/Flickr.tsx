// Types
import FlickrController from 'app/controllers/rest/flickr';
import FlickrItem from 'app/types/rest/flickr';

import Loading from 'app/components/layout/Loading';

const { Component } = wp.element;

class Flickr extends Component {
  componentDidMount(): void {
    FlickrController.getInstance().request(this);
  }

  render(): JSX.Element {
    const flickr: FlickrController = FlickrController.getInstance();

    if (flickr.isLoading()) {
      return (<Loading />);
    }

    if (!flickr.isInit() || flickr.isFailed()) {
      return null;
    }

    return (
      <div id="Flickr">
        <h1><span>Photo Stream</span></h1>

        <div className="row">
          {flickr.getItems().map((item: FlickrItem) => (
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
