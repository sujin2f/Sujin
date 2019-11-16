declare module '*.jpg';
declare module '*.svg';
declare module '*.png';

declare const wp: any;
declare const React: any;
declare const sujin: {
  title: string;
  description: string;
  logo: string;
  ogImage: string;
}

const { Component } = wp.element;
declare type ReactComponent = typeof Component;
