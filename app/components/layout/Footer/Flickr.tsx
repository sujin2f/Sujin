/** app/components/layout/Footer/Flickr */

import { WithController } from 'app/scenes/WithController';

// Controller
import { IRestController } from 'app/controllers/rest';
import FlickrController from 'app/controllers/rest/flickr';

// Item
import { IFlickr } from 'app/items/rest/interface/flickr';

// Wordpress
const { compose } = wp.compose;
const { Fragment } = wp.element;

class Flickr extends WithController {
  public getController(): IRestController {
    return FlickrController.getInstance().addComponent(this);
  }

  render(): JSX.Element {
    this.request();
    const isPending = this.isPending();

    if (isPending) {
      return (<Fragment />);
    }

    const flickr = this.getController();

    return (
      <div id="Flickr">
        <h1><span>Photo Stream</span></h1>

        <div className="row">
          {flickr.entities.map((item: IFlickr) => (
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
