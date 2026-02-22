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

export const REVALIDATION = IS_DEV || process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD ? 1 : HOUR_IN_SECONDS

export const COOKIE_KEY_ACCESS_TOKEN = 'sujinc.com/access'
export const COOKIE_KEY_REFRESH_TOKEN = 'sujinc.com/refresh'
export const COOKIE_KEY_USER_INFO = 'sujinc.com/user-info'

const menuFixture: MenuItem = {
    title: 'Home',
    target: '',
    link: '/',
    children: [],
    position: '',
    id: 0,
    order: 0,
}
export const DEFAULT_MENUS: MenuItem[] = [
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
        ],
    },
]
