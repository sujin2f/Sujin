import Matched from 'app/types/matched';

export default interface GlobalState {
  history: {
    history: any;
    location: any;
    matched: Matched;
  };
  mobileMenu: boolean;
  title: string;
}
