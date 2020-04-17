/*
 * Enums
 * constants/enum
 */

export enum TermTypes {
  Category = 'category',
  Tag = 'tag',
  Search = 'search',
  RecentPosts = 'recentPosts',
}

export enum ResponseCode {
  NoContent = 204,
  Success = 200,
  NotFound = 404,
}

export enum RequestState {
  Loading = 'Loading',
  Failed = 'Failed',
}

export const isAvailablle = (element: any): boolean => {
  return element && RequestState.Loading !== element && RequestState.Failed !== element;
}
