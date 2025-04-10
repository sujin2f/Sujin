import { MENU_NAMES } from '@app/_lib/types'
import type { MenuItem } from '@common/types/menu'

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
export const DEFAULT_THUMBNAIL = `${BASE_URL}/assets/thumbnail.png`
export const TWITTER_SHARE = 'https://www.twitter.com/intent/tweet'
export const FACEBOOK_SHARE = 'https://www.facebook.com/sharer/sharer.php'

export type Metadata = {
    title: string
    description: string
    keywords: string[]
    openGraph: { url: string }
}
export const METADATA: Record<string, Metadata> = {
    '/dev-tools/case': {
        title: 'Case Tool',
        description: 'Convert a string into many cases.',
        keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
        openGraph: {
            url: `${BASE_URL}/dev-tools/case`,
        },
    },
    '/dev-tools/text-sort': {
        title: 'Text Sort',
        description: 'Text sorting tool',
        keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
        openGraph: {
            url: `${BASE_URL}/dev-tools/text-sort`,
        },
    },
    '/ether/kor': {
        title: 'Ether',
        description: '물질의 공간성과 시간성에 대한 가설',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${BASE_URL}/ether/kor`,
        },
    },
    '/ether/kor/document/hypothesis': {
        title: '가설 제시',
        description: 'Brief History of the Study',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${BASE_URL}/ether/kor/document/hypothesis`,
        },
    },
    '/ether/kor/document/classic-physics': {
        title: '가설의 검증(1): 고전 물리학',
        description: '보어의 원자 모형에 기초한 광자-에테르의 방출 파장',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${BASE_URL}/ether/kor/document/classic-physics`,
        },
    },
    '/ether/kor/document/rydberg-formula': {
        title: '가설의 검증(2): 뤼드베리 방정식',
        description: '다전자원자에서 뤼드베리 방정식 적용',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${BASE_URL}/ether/kor/document/rydberg-formula`,
        },
    },
    '/ether/kor/document/analysis': {
        title: '가설의 검증(3): 방출 에너지 분석',
        description: '관측값과의 비교',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${BASE_URL}/ether/kor/document/analysis`,
        },
    },
    '/ether/kor/document/between': {
        title: '가설의 검증(4): 비교 기준, Between',
        description: '오차 보정',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${BASE_URL}/ether/kor/document/between`,
        },
    },
    '/ether/kor/document/conclusion': {
        title: '결론',
        description: '결론과 후속 연구',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${BASE_URL}/ether/kor/document/conclusion`,
        },
    },
    '/ether': {
        title: 'Ether',
        description: 'Hypothesis on the Spatial and Temporal Aspects of Matter',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${BASE_URL}/ether`,
        },
    },
    '/ether/document/hypothesis': {
        title: 'Hypothesis',
        description: 'Brief History of the Study',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${BASE_URL}/ether/document/hypothesis`,
        },
    },
    '/ether/document/classic-physics': {
        title: 'Proof(1): Classic Physics',
        description: "Ether from Bohr's Atomic Model",
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${BASE_URL}/ether/document/classic-physics`,
        },
    },
    '/ether/document/rydberg-formula': {
        title: 'Proof(2): Reinterpretation of Rydberg Formula',
        description: 'Rydberg Formula for Multi Electron Atoms',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${BASE_URL}/ether/document/rydberg-formula`,
        },
    },
    '/ether/document/analysis': {
        title: 'Proof(3): Emission Energy Analysis',
        description: 'Comparing with Actual Data',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${BASE_URL}/ether/document/analysis`,
        },
    },
    '/ether/document/between': {
        title: 'Proof(4): Between Comparison',
        description: 'Minimizing Margin',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${BASE_URL}/ether/document/between`,
        },
    },
    '/ether/document/conclusion': {
        title: 'Conclusion',
        description: 'For Further Study',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${BASE_URL}/ether/document/conclusion`,
        },
    },
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
            title: 'Blog',
            link: '/archive/category/blog/page/1',
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
        },
        {
            ...menuFixture,
            title: 'Loading',
            link: '/design-system/pages/loading',
        },
        {
            ...menuFixture,
            title: 'Not Found',
            link: '/design-system/pages/not-found',
        },
    ],
} as const
