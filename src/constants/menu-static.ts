import { MenuItem } from '@src/types/wordpress'

export const PROJECT_SEO: Record<
    string,
    { seoTitle: string; seoDescription: string }
> = {
    '/dev-tools/case': {
        seoTitle: 'Case Tool',
        seoDescription: 'Convert keyword into many cases',
    },
    '/dev-tools/text-sort': {
        seoTitle: 'Text Sort',
        seoDescription: 'Sorting tool',
    },
}

export const PROJECT: MenuItem = {
    id: 345678909876543,
    title: 'Dev Tool',
    target: '',
    link: '/dev-tools/case',
    htmlClass: [],
    children: [
        {
            id: 3456789876543,
            title: 'Case Tool',
            target: '',
            link: '/dev-tools/case',
            htmlClass: [],
            children: [],
            parent: 0,
        },
        {
            id: 123456787654,
            title: 'Text Sort',
            target: '',
            link: '/dev-tools/text-sort',
            htmlClass: [],
            children: [],
            parent: 0,
        },
    ],
    parent: 0,
}
