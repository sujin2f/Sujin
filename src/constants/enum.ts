/*
 * Enums
 * constants/enum
 */

export type TermTypes = 'category' | 'tag' | 'search' | 'recentPosts';

export type PublicClasses = 'scrolled' | 'mobile-menu' | 'stretched-background' | 'hide-footer' | 'hide-header';

export type PageHeaderString = 'background' | 'backgroundColor' | 'description' | 'prefix' | 'title' | 'icon';
export type PageHeaderBoolean = 'isLoading' | 'useBackgroundColor';
export type PageHeader = PageHeaderString & PageHeaderBoolean;

export enum ResponseCode {
  NoContent = 204,
  Success = 200,
  NotFound = 404,
};

export type RequestState = 'Loading' | 'Failed' | 'Success';
