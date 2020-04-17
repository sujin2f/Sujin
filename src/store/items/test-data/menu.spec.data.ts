import { Menu } from '../menu';

const rawData01 = {
  ID: 14995,
  children: [],
  classes: [''],
  parent: 0,
  target: '_self',
  title: 'About',
  url: 'http:\/\/sujinc.com\/about\/',
};
const rawData02 = {
  ID: 14997,
  children: [],
  classes: [''],
  parent: 0,
  target: '_self',
  title: 'Portfolio',
  url: 'http:\/\/sujinc.com\/category\/portfolio\/',
};
const rawData03 = {
  ID: 14998,
  children: [
    {
      ID: 15023,
      title: 'Dev Tools',
      url: false,
      target: '_self',
      parent: 14998,
      classes: [''],
      children: []
    }
  ],
  classes: [''],
  parent: 0,
  target: '_self',
  title: 'Dev.',
  url: 'http:\/\/sujinc.com\/category\/development\/',
};
const rawData04 = {
  ID: 14996,
  children: [],
  classes: [''],
  parent: 0,
  target: '_self',
  title: 'Blog',
  url: 'http:\/\/sujinc.com\/category\/blog\/',
};

export const rawData = [
  rawData01,
  rawData02,
  rawData03,
  rawData04,
];
