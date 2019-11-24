import Flickr from 'app/items/rest/flickr';
import RestController from 'app/controllers/rest';

/*
 * Flickr Controller
 */
export default class FlickrController extends RestController<Flickr> {
  public static instance: FlickrController;

  public static getInstance(): FlickrController {
    if (!this.instance) {
      this.instance = new FlickrController(Flickr);
    }
    return this.instance;
  }

  protected getRestUrl(): string {
    return '/wp-json/sujin/v1/flickr/';
  }
}
