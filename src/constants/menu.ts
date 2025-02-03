import type { MenuItem } from '@src/types/wordpress'

const menu = {
    id: 0,
    title: 'Home',
    target: '',
    link: '/ether',
    htmlClass: [],
    children: [],
    parent: 0,
}

export const MenuDefault: MenuItem[] = [
    {
        ...menu,
        title: 'About',
        link: '/about',
    },
    {
        ...menu,
        title: 'Blog',
        link: '/archive/category/blog/page/1',
    },
    {
        ...menu,
        title: 'Portfolio',
        link: '/archive/category/portfolio/page/1',
    },
    {
        ...menu,
        title: 'Projects',
        link: '#',
        children: [
            {
                ...menu,
                title: 'Dev Tool',
                link: '/dev-tools/case',
            },
            {
                ...menu,
                title: 'Ether',
                link: '/ether',
            },
        ],
    },
]

export const MenuEther: MenuItem[] = [
    {
        ...menu,
        title: 'Home',
        link: '/ether',
    },
    {
        ...menu,
        title: 'Document',
        link: '#',
        children: [
            {
                ...menu,
                title: 'Hypothesis',
                link: '/ether/document/hypothesis',
            },
            {
                ...menu,
                title: 'Proof(1): Classic Physics',
                link: '/ether/document/classic-physics',
            },
            {
                ...menu,
                title: 'Proof(2): Reinterpretation of Rydberg Formula',
                link: '/ether/document/rydberg-formula',
            },
            {
                ...menu,
                title: 'Proof(3): Emission Energy Analysis',
                link: '/ether/document/analysis',
            },
            {
                ...menu,
                title: 'Proof(4): Between Comparison',
                link: '/ether/document/between',
            },
            {
                ...menu,
                title: 'Conclusion',
                link: '/ether/document/conclusion',
            },
        ],
    },
    {
        ...menu,
        title: 'Data',
        link: '/ether/data/ether/1/1',
    },
    {
        ...menu,
        title: '🇰🇷 Korean',
        link: '/ether/kor',
    },
]

export const MenuEtherKor: MenuItem[] = [
    {
        ...menu,
        title: 'Home',
        link: '/ether/kor',
    },
    {
        ...menu,
        title: '문서',
        link: '#',
        children: [
            {
                ...menu,
                title: '가설 제시',
                link: '/ether/kor/document/hypothesis',
            },
            {
                ...menu,
                title: '가설의 검증(1): 고전 물리학',
                link: '/ether/kor/document/classic-physics',
            },
            {
                ...menu,
                title: '가설의 검증(2): 뤼드베리 방정식의 재정립',
                link: '/ether/kor/document/rydberg-formula',
            },
            {
                ...menu,
                title: '가설의 검증(3): 방출 에너지 분석',
                link: '/ether/kor/document/analysis',
            },
            {
                ...menu,
                title: '가설의 검증(4): 비교기준, Between',
                link: '/ether/kor/document/between',
            },
            {
                ...menu,
                title: '결론',
                link: '/ether/kor/document/conclusion',
            },
        ],
    },
    {
        ...menu,
        title: 'Data',
        link: '/ether/data/ether/1/1',
    },
    {
        ...menu,
        title: 'English',
        link: '/ether',
    },
]

export const MenuDevTool: MenuItem[] = [
    {
        ...menu,
        title: 'Home',
        link: '/',
    },
    {
        ...menu,
        title: 'Case Tool',
        link: '/dev-tools/case',
    },
    {
        ...menu,
        title: 'Text Sort',
        link: '/dev-tools/text-sort',
    },
]
