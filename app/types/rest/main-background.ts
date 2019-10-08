export default interface MainBackground {
  desktop: string;
  mobile: string;
  title: string;
}

export type MainBackgroundArray = Array<MainBackground> | boolean | undefined; // true is loading, false is failed, undefined is not yet loaded.
