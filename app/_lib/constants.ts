/* T_Types */
import type { MenuItem } from '@common/types/menu'

export const DEFAULT_THUMBNAIL = `/assets/thumbnail.png`

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

export const TAILWIND_CARD_IMAGE =
    'w-full h-full object-cover object-center transition-transform group-hover:rotate-7 group-hover:scale-150'
