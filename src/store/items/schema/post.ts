/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

import { Post } from "scenes/public/Post";

export type Post = SimplePost & {
  /**
   * Content
   */
  content?: string;
  /**
   * Comment status
   */
  commentStatus?: boolean;
  /**
   * Series
   */
  series?: SimplePost[];
  /**
   * Prev / Next
   */
  prevNext?: {
    prev?: SimplePost;
    next?: SimplePost;
  };
  /**
   * Related contents
   */
  related?: SimplePost[];
  /**
   * Post Type
   */
  type?: 'post' | 'page';
};

export interface SimplePost {
  /**
   * Unique ID
   */
  id: number;
  /**
   * Post slug
   */
  slug: string;
  /**
   * Title
   */
  title: string;
  /**
   * Excerpt
   */
  excerpt?: string;
  /**
   * Date
   */
  date: string;
  /**
   * Link URL
   */
  link: string;
  /**
   * Tags
   */
  tags?: Term[];
  thumbnail?: Image;
  /**
   * Meta data
   */
  meta: {
    background?: Image;
    icon?: Image;
    list?: Image;
    title?: Image;
    thumbnail?: Image;
    backgroundColor?: string;
    useBackgroundColor?: boolean;
  };
}
export interface Term {
  /**
   * Term name
   */
  name: string;
  /**
   * Term slug
   */
  slug: string;
  /**
   * Term ID
   */
  termId: number;
}
export interface Image {
  /**
   * Large size image
   */
  large?: string;
  /**
   * Medium size image
   */
  medium?: string;
  /**
   * Small size image
   */
  small?: string;
  /**
   * Tiny size image
   */
  tiny?: string;
}
