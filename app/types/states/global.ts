import { MenuArray } from 'app/types/responses/menu';
import { MainBackgroundArray } from 'app/types/responses/main-background';
import { FlickrArray } from 'app/types/responses/flickr';

export default interface GlobalState {
  history: {
    history: any;
    matched: any;
    location: any;
  };
  mobileMenu: boolean;
  title: string;
  menu: {
    [menupName: string]: MenuArray;
  };
  backgrounds: MainBackgroundArray;
  flickr: FlickrArray;
}
