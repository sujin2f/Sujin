export default interface Flickr {
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

export type FlickrArray = Array<Flickr> | boolean | undefined; // true is loading, false is failed, undefined is not yet loaded
