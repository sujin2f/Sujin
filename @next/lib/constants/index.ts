import { PHASE_PRODUCTION_BUILD } from 'next/constants'
import { HOUR_IN_SECONDS } from '@sujin/share/constants/datetime'
import { IS_DEV } from '@sujin/share/constants/helper'
import type { MenuItem } from '@sujin/lib/types/menu'

export const DEFAULT_THUMBNAIL = `/assets/thumbnail.png`
export const PER_PAGE = 12

export type Metadata = {
    title: string
    description: string
    keywords: string[]
    openGraph: { url: string }
}

/**
 * Menu names
 * @enum
 */
export enum MENU_NAMES {
    MAIN = 'main',
    DEV_TOOL = 'devtool',
    ETHER = 'ether',
    ETHER_KOR = 'ether-kor',
    DESIGN_SYSTEM = 'design-system',
    RECIPE = 'recipe',
    RECIPE_USER = 'recipe-user',
}

const menuFixture: MenuItem = {
    title: 'Home',
    target: '',
    link: '/',
    children: [],
}
export const MENUS: Record<MENU_NAMES, MenuItem[]> = {
    [MENU_NAMES.MAIN]: [
        {
            ...menuFixture,
            title: 'About',
            link: '/about',
        },
        {
            ...menuFixture,
            title: 'Portfolio',
            link: '/archive/category/portfolio/page/1',
        },
        {
            ...menuFixture,
            title: 'Projects',
            link: '#',
            children: [
                {
                    ...menuFixture,
                    title: 'Focus Browser',
                    link: 'https://github.com/sujin2f/focus-browser',
                    target: '_blank',
                },
                {
                    ...menuFixture,
                    title: 'Recipe',
                    link: '/recipe',
                },
                {
                    ...menuFixture,
                    title: 'Dev Tool',
                    link: '/dev-tools/case',
                },
                {
                    ...menuFixture,
                    title: 'Ether',
                    link: '/ether',
                },
            ],
        },
    ],
    [MENU_NAMES.ETHER]: [
        {
            ...menuFixture,
            title: 'Home',
            link: '/ether',
        },
        {
            ...menuFixture,
            title: 'Document',
            link: '#',
            children: [
                {
                    ...menuFixture,
                    title: 'Hypothesis',
                    link: '/ether/document/hypothesis',
                },
                {
                    ...menuFixture,
                    title: 'Proof(1): Classic Physics',
                    link: '/ether/document/classic-physics',
                },
                {
                    ...menuFixture,
                    title: 'Proof(2): Reinterpretation of Rydberg Formula',
                    link: '/ether/document/rydberg-formula',
                },
                {
                    ...menuFixture,
                    title: 'Proof(3): Emission Energy Analysis',
                    link: '/ether/document/analysis',
                },
                {
                    ...menuFixture,
                    title: 'Proof(4): Between Comparison',
                    link: '/ether/document/between',
                },
                {
                    ...menuFixture,
                    title: 'Conclusion',
                    link: '/ether/document/conclusion',
                },
            ],
        },
        {
            ...menuFixture,
            title: 'Data',
            link: '/ether/data/ether/1/1',
        },
        {
            ...menuFixture,
            title: '🇰🇷 Korean',
            link: '/ether/kor',
        },
    ],
    [MENU_NAMES.ETHER_KOR]: [
        {
            ...menuFixture,
            title: 'Home',
            link: '/ether/kor',
        },
        {
            ...menuFixture,
            title: '문서',
            link: '#',
            children: [
                {
                    ...menuFixture,
                    title: '가설 제시',
                    link: '/ether/kor/document/hypothesis',
                },
                {
                    ...menuFixture,
                    title: '가설의 검증(1): 고전 물리학',
                    link: '/ether/kor/document/classic-physics',
                },
                {
                    ...menuFixture,
                    title: '가설의 검증(2): 뤼드베리 방정식의 재정립',
                    link: '/ether/kor/document/rydberg-formula',
                },
                {
                    ...menuFixture,
                    title: '가설의 검증(3): 방출 에너지 분석',
                    link: '/ether/kor/document/analysis',
                },
                {
                    ...menuFixture,
                    title: '가설의 검증(4): 비교기준, Between',
                    link: '/ether/kor/document/between',
                },
                {
                    ...menuFixture,
                    title: '결론',
                    link: '/ether/kor/document/conclusion',
                },
            ],
        },
        {
            ...menuFixture,
            title: 'Data',
            link: '/ether/data/ether/1/1',
        },
        {
            ...menuFixture,
            title: 'English',
            link: '/ether',
        },
    ],
    [MENU_NAMES.DEV_TOOL]: [
        {
            ...menuFixture,
            title: 'Home',
            link: '/',
        },
        {
            ...menuFixture,
            title: 'Case Tool',
            link: '/dev-tools/case',
        },
        {
            ...menuFixture,
            title: 'Text Sort',
            link: '/dev-tools/text-sort',
        },
        {
            ...menuFixture,
            title: 'External',
            link: '#',
            children: [
                {
                    ...menuFixture,
                    title: 'JSON Formatter',
                    link: 'https://jsonformatter.curiousconcept.com/',
                    target: '_blank',
                },
                {
                    ...menuFixture,
                    title: 'Text Diff',
                    link: 'https://text-compare.com/',
                    target: '_blank',
                },
            ],
        },
    ],
    [MENU_NAMES.DESIGN_SYSTEM]: [
        {
            ...menuFixture,
            title: 'Home',
            link: '/',
        },
        {
            ...menuFixture,
            title: 'Elements',
            link: '/design-system/elements',
            children: [
                {
                    ...menuFixture,
                    title: 'HTML Elements',
                    link: '/design-system/elements',
                },
                {
                    ...menuFixture,
                    title: 'Components',
                    link: '/design-system/components',
                },
            ],
        },
        {
            ...menuFixture,
            title: 'Not Found',
            link: '/design-system/pages/not-found',
        },
    ],
    [MENU_NAMES.RECIPE]: [
        {
            ...menuFixture,
            title: 'Home',
            link: '/recipe',
        },
        {
            ...menuFixture,
            title: 'Recipes',
            link: '/recipe/list/1',
        },
    ],
    [MENU_NAMES.RECIPE_USER]: [
        {
            ...menuFixture,
            title: 'Home',
            link: '/recipe',
        },
        {
            ...menuFixture,
            title: 'Recipes',
            link: '/recipe/list/1',
        },
        {
            ...menuFixture,
            title: 'My Recipes',
            link: '/recipe/mine/1',
        },
        {
            ...menuFixture,
            title: 'Add',
            link: '/recipe/add',
        },
    ],
} as const

export const REVALIDATION = IS_DEV || process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD ? 1 : HOUR_IN_SECONDS

export const COOKIE_KEY_ACCESS_TOKEN = 'sujinc.com/access'
export const COOKIE_KEY_REFRESH_TOKEN = 'sujinc.com/refresh'
export const COOKIE_KEY_USER_INFO = 'sujinc.com/user-info'
