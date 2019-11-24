import Background from './background';

const rawData01 =   {
  desktop: 'http://test.org/desktop.jpg',
  mobile: 'http://test.org/mobile.jpg',
  title: 'Title 01',
};

const rawData02 =   {
  desktop: 'http://test.org/desktop.svg',
  mobile: 'http://test.org/mobile.svg',
  title: 'Title 02',
};

export const rawData = [rawData01, rawData02];

export const Backgrounds = [
  new Background(rawData01),
  new Background(rawData02),
];
