import Matched from 'app/types/matched';
import { MenuArray } from 'app/types/rest/menu';
import { MainBackgroundArray } from 'app/types/rest/main-background';

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
}
