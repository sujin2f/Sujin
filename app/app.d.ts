declare module '*.jpg';
declare module '*.svg';
declare module '*.png';

declare const wp: any;
declare const React: any;
declare const sujin: {
  description: string;
  frontPage: string;
  hideFrontFooter: boolean;
  hideFrontHeader: boolean;
  ogImage: string;
  showOnFront: string;
  title: string;
}
declare const adsbygoogle: any;

const { Component } = wp.element;
declare type ReactComponent = typeof Component;
