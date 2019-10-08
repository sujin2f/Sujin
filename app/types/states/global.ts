import Matched from 'app/types/matched';
import { MenuArray } from 'app/types/rest/menu';
import { MainBackgroundArray } from 'app/types/rest/main-background';
import FlickrController from 'app/types/rest/flickr';

export default interface GlobalState {
  history: {
    history: any;
    location: any;
    matched: Matched;
  };
  mobileMenu: boolean;
  title: string;
  menu: {
    [menupName: string]: MenuArray;
  };
  backgrounds: MainBackgroundArray;
  flickr: FlickrController;
}
