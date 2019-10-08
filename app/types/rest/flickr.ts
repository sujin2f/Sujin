/// <reference path="flickr.d.ts" />
import axios from 'axios';

// Types
import * as FlickrTypes from 'Flickr';
// Constants
import { STORE } from 'app/constants/common';
// WP features
const { dispatch, select } = wp.data;

class FlickrItem {
  title: string;
  link: string;
  media: {
    origin: string;
    s: string;
    t: string;
    b: string;
    m: string;
  };

  constructor(data: any) {
    this.title = data.title;
    this.link = data.link;
    this.media = data.media;
  }
}

/*
 * Flickr Controller
 */
export default class FlickrController {
  static instance: FlickrController;
  readonly REST_URL = 'wp-json/sujin/v1/flickr/';

  private entities: FlickrTypes.state;
  private loading: boolean = false;
  private failed: boolean = false;

  /*
   * Get singleton object
   */
  static getInstance(): FlickrController {
    if (!FlickrController.instance) {
      this.instance = new FlickrController();
    }
    return this.instance;
  }

  /*
   * REST request
   */
  public request(): void {
    dispatch(STORE).requestFlickrInit();

    axios.get(this.REST_URL)
      .then((response) => {
        if (response.status === 204) {
          dispatch(STORE).requestFlickrFail();
          return;
        }

        this.entities = [];
        this.entities = response.data.map((item) => new FlickrItem(response.data));
        dispatch(STORE).requestFlickrSuccess();
      }).catch(() => {
        dispatch(STORE).requestFlickrFail();
      });
  }

  public set() {
    this.loading = false;
    this.failed = false;
  }

  public load() {
    this.loading = true;
    this.failed = false;
  }

  public fail() {
    this.loading = false;
    this.failed = true;
  }

  public isNotInitialized() {
    return typeof this.entities === 'undefined';
  }

  public isLoading(): boolean {
    return this.loading;
  }

  public isFailed(): boolean {
    return this.failed;
  }
}
