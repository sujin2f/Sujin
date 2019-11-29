import Flickr from 'app/items/rest/flickr';
import { IFlickr } from 'app/items/rest/interface/flickr';

// Controller
import { RestController, IRestController } from 'app/controllers/rest';

/*
 * Flickr Controller
 */
export default class FlickrController extends RestController<IFlickr> {
  public static instance: FlickrController;

  public static getInstance(): IRestController {
    if (!this.instance) {
      this.instance = new FlickrController(Flickr);
    }
    return this.instance;
  }

  protected getRestUrl(): string {
    return '/wp-json/sujin/v1/flickr';
  }
}
