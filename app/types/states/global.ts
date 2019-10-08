import Matched from 'app/types/matched';
import { MenuArray } from 'app/types/rest/menu';

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
}
