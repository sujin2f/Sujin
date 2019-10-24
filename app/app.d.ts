declare module '*.jpg';
declare module '*.svg';
declare module '*.png';

declare const wp: any;
declare const React: any;

const { Component } = wp.element;
declare type ReactComponent = typeof Component;
