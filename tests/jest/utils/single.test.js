global.wp = {
  shortcode: require('@wordpress/shortcode'),
  element: require('@wordpress/element'),
  data: require('@wordpress/data'),
  compose: require('@wordpress/compose'),
  url: require('@wordpress/url'),
};

const {
  parseContent,
  parseSeries,
  shareTwitter,
  shareFacebook,
} = require('../../../app/utils/single');

test('Empty Content Parse Test', () => {
  const content = '';
  const parsed = parseContent(content);

  expect(parsed).toEqual([]);
});

test('No-Shortcode Content Parse Test', () => {
  const content = 'Lorem ipsum dolor sit amet';
  const parsed = parseContent(content);

  expect(parsed[0].props.dangerouslySetInnerHTML.__html).toEqual('Lorem ipsum dolor sit amet');
});

test('[gist /], [carousel /], [tweet /] Content Parse Test', () => {
  let content = 'Lorem ipsum dolor sit amet';
  content += '[gist id="d6ff10312084824d2a2058a70dbdb961" file="docker-compose.yml" /]';
  content += 'Lorem ipsum dolor sit amet';
  content += '[carousel sc1="http://sujinc.test/wp-content/uploads/2018/05/myjf-sc1.jpg" sc2="http://sujinc.test/wp-content/uploads/2018/05/myjf-sc2.jpg" /]';
  content += 'Lorem ipsum dolor sit amet';
  content += '[tweet id="476962421873975296" /]';
  content += 'Lorem ipsum dolor sit amet';
  content += '[tweet id="476962421873975298" /]';
  content += 'Lorem ipsum dolor sit amet';
  content += '[dev-tools /]';
  content += 'Lorem ipsum dolor sit amet';
  content += '[dev-tools id="text-sort" /]';
  content += 'Lorem ipsum dolor sit amet';
  content += '[dev-tools id="symbol-alignment" /]';

  const parsed = parseContent(content);

  expect(typeof parsed).toEqual('object');
  expect(parsed.length).toEqual(14);

  console.log(parsed[5].type.name);

  expect(parsed[0].type).toEqual('section');
  expect(parsed[1].type.name).toEqual('Gist');
  expect(parsed[2].type).toEqual('section');
  expect(parsed[3].type.name).toEqual('Carousel');
  expect(parsed[4].type).toEqual('section');
  expect(parsed[5].type.name).toEqual('TweetEmbed');
  expect(parsed[6].type).toEqual('section');
  expect(parsed[7].type.name).toEqual('TweetEmbed');
  expect(parsed[8].type).toEqual('section');
  expect(parsed[9].type.name).toEqual('CaseTool');
  expect(parsed[10].type).toEqual('section');
  expect(parsed[11].type.name).toEqual('TextSort');
  expect(parsed[12].type).toEqual('section');
  expect(parsed[13].type.name).toEqual('SymbolAlignment');
});

test('Series', () => {
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

  expect(parsed[0].props.children[0].type).toEqual('h2');
  expect(parsed[0].props.children[1].props.children.length).toEqual(2);
});

test('Empty Series', () => {
  const series = '';
  const parsed = parseSeries(1, series);

  expect(parsed).toEqual([]);
});

test('Test Share Twitter', () => {
  global.open = jest.fn();
  shareTwitter('title');
  expect(global.open).toBeCalledWith(expect.any(String), 'Twitter', expect.any(String));
});

test('Test Share Facebbook', () => {
  global.open = jest.fn();
  shareFacebook('title');
  expect(global.open).toBeCalledWith(expect.any(String), 'Facebook', expect.any(String));
});
