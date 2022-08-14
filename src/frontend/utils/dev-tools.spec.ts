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
    sortText,
    symbolAlignment,
} from './dev-tools'

test('Case Tool', () => {
    const preserved = preserveCase(
        'Sed utPerspiciatis-unde Omnis_iste---natus____error Sit voluptatem.',
    )
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
    ])

    const camel = camelCase(preserved)
    expect(camel).toEqual(
        'sedUtPerspiciatisUndeOmnisIsteNatusErrorSitVoluptatem',
    )

    const constant = constantCase(preserved)
    expect(constant).toEqual(
        'SED_UT_PERSPICIATIS_UNDE_OMNIS_ISTE_NATUS_ERROR_SIT_VOLUPTATEM',
    )

    const dot = dotCase(preserved)
    expect(dot).toEqual(
        'sed.ut.perspiciatis.unde.omnis.iste.natus.error.sit.voluptatem',
    )

    const param = paramCase(preserved)
    expect(param).toEqual(
        'sed-ut-perspiciatis-unde-omnis-iste-natus-error-sit-voluptatem',
    )

    const pascal = pascalCase(preserved)
    expect(pascal).toEqual(
        'SedUtPerspiciatisUndeOmnisIsteNatusErrorSitVoluptatem',
    )

    const path = pathCase(preserved)
    expect(path).toEqual(
        'sed/ut/perspiciatis/unde/omnis/iste/natus/error/sit/voluptatem',
    )

    const snake = snakeCase(preserved)
    expect(snake).toEqual(
        'sed_ut_perspiciatis_unde_omnis_iste_natus_error_sit_voluptatem',
    )

    const title = titleCase(preserved)
    expect(title).toEqual(
        'Sed Ut Perspiciatis Unde Omnis Iste Natus Error Sit Voluptatem',
    )
})

test('Text Sort', () => {
    const text = [
        'Lorem ipsum dolor sit amet,',
        'consectetur adipiscing elit,',
        'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        'Ut enim ad minim veniam,',
        'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        'Duis aute irure dolor in reprehenderit in voluptate velit',
        'esse cillum dolore eu fugiat nulla pariatur.',
        'Excepteur sint occaecat cupidatat non proident,',
        'sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ].join('\n')

    const actual = sortText(text, false)
        .split('\n')
        .map((line) => line.charAt(0))
        .join('')

    expect(actual).toEqual('DELUceqss')
})

test('Symbol Alignment', () => {
    const text = [
        'Lorem => amet,',
        'consectetur => elit,',
        'sed => aliqua.',
        'Ut => veniam,',
        'quis => consequat.',
        'Duis => velit',
        'esse => pariatur.',
        'Excepteur => proident,',
        'sunt => laborum.',
    ].join('\n')

    const actual = symbolAlignment(text, '=>').split('\n')

    expect(actual).toEqual([
        'Lorem       => amet,',
        'consectetur => elit,',
        'sed         => aliqua.',
        'Ut          => veniam,',
        'quis        => consequat.',
        'Duis        => velit',
        'esse        => pariatur.',
        'Excepteur   => proident,',
        'sunt        => laborum.',
    ])
})
