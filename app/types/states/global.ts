import Matched from 'app/types/matched';
import { MenuArray } from 'app/types/responses/menu';
import { MainBackgroundArray } from 'app/types/responses/main-background';
import { FlickrArray } from 'app/types/responses/flickr';

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
  flickr: FlickrArray;
}
