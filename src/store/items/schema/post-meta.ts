/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface PostMeta {
  background: Image
  icon: Image
  list: Image
  title: Image
  thumbnail: Image
  backgroundColor: string
  useBackgroundColor: boolean
}
export interface Image {
  /**
   * Large size image
   */
  large: string
  /**
   * Medium size image
   */
  medium: string
  /**
   * Small size image
   */
  small: string
  /**
   * Tiny size image
   */
  tiny: string
}
