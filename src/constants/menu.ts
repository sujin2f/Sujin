import { MenuItem } from '@src/types/wordpress'

const menu = {
    id: 0,
    title: 'Home',
    target: '',
    link: '/ether',
    htmlClass: [],
    children: [],
    parent: 0,
}

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
]
