import {
  preserveCase,
  camelCase,
  constantCase,
  dotCase,
  paramCase,
  pascalCase,
  pathCase,
  snakeCase,
  titleCase,

  // TODO
  // sortText,
  // symbolAlignment,
} from './dev-tools';

test('Case Tool', () => {
  const preserved = preserveCase('Sed utPerspiciatis-unde Omnis_iste---natus____error Sit voluptatem.');
  expect(preserved).toEqual([
    'sed',
    'ut',
    'perspiciatis',
    'unde',
    'omnis',
    'iste',
    'natus',
    'error',
    'sit',
    'voluptatem',
  ]);

  const camel = camelCase(preserved);
  expect(camel).toEqual('sedUtPerspiciatisUndeOmnisIsteNatusErrorSitVoluptatem');

  const constant = constantCase(preserved);
  expect(constant).toEqual('SED_UT_PERSPICIATIS_UNDE_OMNIS_ISTE_NATUS_ERROR_SIT_VOLUPTATEM');

  const dot = dotCase(preserved);
  expect(dot).toEqual('sed.ut.perspiciatis.unde.omnis.iste.natus.error.sit.voluptatem');

  const param = paramCase(preserved);
  expect(param).toEqual('sed-ut-perspiciatis-unde-omnis-iste-natus-error-sit-voluptatem');

  const pascal = pascalCase(preserved);
  expect(pascal).toEqual('SedUtPerspiciatisUndeOmnisIsteNatusErrorSitVoluptatem');

  const path = pathCase(preserved);
  expect(path).toEqual('sed/ut/perspiciatis/unde/omnis/iste/natus/error/sit/voluptatem');

  const snake = snakeCase(preserved);
  expect(snake).toEqual('sed_ut_perspiciatis_unde_omnis_iste_natus_error_sit_voluptatem');

  const title = titleCase(preserved);
  expect(title).toEqual('Sed Ut Perspiciatis Unde Omnis Iste Natus Error Sit Voluptatem');
});
