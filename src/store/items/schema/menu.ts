/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface Menu {
  /**
   * Unique ID of WP Post object
   */
  ID: number
  /**
   * The title of the menu item.
   */
  title: string
  /**
   * Link URL
   */
  url: string
  /**
   * Link target HTML attribute
   */
  target: '_blank' | '_self'
  /**
   * Parent ID
   */
  parent: number
  /**
   * HTML class attributes
   */
  classes: string[]
  /**
   * Child menu items
   */
  children: Menu[]
}
