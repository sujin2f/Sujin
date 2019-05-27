global.wp = {
  shortcode: require('@wordpress/shortcode'),
  element: require('@wordpress/element'),
  data: require('@wordpress/data'),
  compose: require('@wordpress/compose'),
};

const {
  parseContent,
  parseSeries,
} = require('../../../app/utils/content');

test( "Empty Content Parse Test", () => {
  const content = '';
  const parsed = parseContent(content);

  expect(parsed).toEqual([]);
});

test( "No-Shortcode Content Parse Test", () => {
  const content = 'Lorem ipsum dolor sit amet';
  const parsed = parseContent(content);

  expect(parsed).toEqual(['Lorem ipsum dolor sit amet']);
});

test( "Content Parse Test", () => {
  const content = 'Lorem ipsum dolor sit amet [gist id="d6ff10312084824d2a2058a70dbdb961" file="docker-compose.yml" /] Lorem ipsum dolor sit amet [carousel sc1="http://sujinc.test/wp-content/uploads/2018/05/myjf-sc1.jpg" sc2="http://sujinc.test/wp-content/uploads/2018/05/myjf-sc2.jpg" /] Lorem ipsum dolor sit amet [tweet id="476962421873975296" /] Lorem ipsum dolor sit amet [tweet id="476962421873975298" /]';
  const parsed = parseContent(content);

  expect(typeof parsed).toEqual('object');
  expect(parsed.length).toEqual(8);
  expect(parsed[0]).toContain('Lorem ipsum dolor sit amet');
  expect(parsed[2]).toContain('Lorem ipsum dolor sit amet');
  expect(parsed[4]).toContain('Lorem ipsum dolor sit amet');
  expect(parsed[6]).toContain('Lorem ipsum dolor sit amet');

  expect(parsed[1].key).toEqual('c37089888bb659d6152d23a4b38436112b232e23');
  expect(parsed[3].key).toEqual('55845d5607676220fda1f795887cac3dd7dd9e65');
  expect(parsed[5].key).toEqual('021fe8f8cac8caac0de764f7175fe947299421cd');
  expect(parsed[7].key).toEqual('eef59b14c904a740feff29af4cc8af4689165e73');
});

test( "Series", () => {
  const series = [
    {
      id: 0,
      link: 'http://localhost/0',
      title: 'Title 1',
    },
    {
      id: 1,
      link: 'http://localhost/1',
      title: 'Title 2',
    },
  ];
  const parsed = parseSeries(1, series);

  expect(parsed.props.children[0].type).toEqual('h2');
  expect(parsed.props.children[1].props.children.length).toEqual(2);
});

test( "Empty Series", () => {
  const series = '';
  const parsed = parseSeries(1, series);

  expect(parsed).toEqual([]);
});
