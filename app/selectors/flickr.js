import { initialState } from 'app/reducers/flickr';

/* eslint-disable import/prefer-default-export */

export const getFlickr = (state) => state.flickr || initialState;

/* eslint-enable import/prefer-default-export */
