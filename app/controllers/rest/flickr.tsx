import FlickrItem from 'app/types/rest/flickr';
import RestController from 'app/controllers/rest/base';

/*
 * Flickr Controller
 */
export default class FlickrController extends RestController<FlickrItem> {
  static instance: FlickrController;

  static getInstance(): FlickrController {
    if (!this.instance) {
      this.instance = new FlickrController(FlickrItem);
    }
    return this.instance;
  }

  protected getRestUrl(): string {
    return '/wp-json/sujin/v1/flickr/';
  }
}
