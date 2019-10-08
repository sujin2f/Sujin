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
}
