declare module "Flickr" {
  export class FlickrItem {
    title: string;
    link: string;
    media: {
      origin: string;
      s: string;
      t: string;
      b: string;
      m: string;
    };
  }

  export type state = Array<FlickrItem> | boolean | undefined; // true is loading, false is failed, undefined is not yet loaded
}
