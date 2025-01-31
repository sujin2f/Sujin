import type { Metadata } from 'next'

export const metadata: Record<string, Metadata> = {
    '/dev-tools/case': {
        title: 'Case Tool',
        description: 'Convert a string into many cases.',
        keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
        openGraph: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/dev-tools/case`,
        },
    },
    '/dev-tools/text-sort': {
        title: 'Text Sort',
        description: 'Text sorting tool',
        keywords: ['Next.js', 'React', 'JavaScript', 'TypeScript', 'Express'],
        openGraph: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/dev-tools/text-sort`,
        },
    },
    '/ether/kor': {
        title: 'Ether',
        description: '물질의 공간성과 시간성에 대한 가설',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/ether/kor`,
        },
    },
    '/ether/kor/document/hypothesis': {
        title: '가설 제시',
        description: 'Brief History of the Study',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/ether/kor/document/hypothesis`,
        },
    },
    '/ether/kor/document/classic-physics': {
        title: '가설의 검증(1): 고전 물리학',
        description: '보어의 원자 모형에 기초한 광자-에테르의 방출 파장',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/ether/kor/document/classic-physics`,
        },
    },
    '/ether/kor/document/rydberg-formula': {
        title: '가설의 검증(2): 뤼드베리 방정식',
        description: '다전자원자에서 뤼드베리 방정식 적용',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/ether/kor/document/rydberg-formula`,
        },
    },
    '/ether/kor/document/analysis': {
        title: '가설의 검증(3): 방출 에너지 분석',
        description: '관측값과의 비교',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/ether/kor/document/analysis`,
        },
    },
    '/ether/kor/document/between': {
        title: '가설의 검증(4): 비교 기준, Between',
        description: '오차 보정',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/ether/kor/document/between`,
        },
    },
    '/ether/kor/document/conclusion': {
        title: '결론',
        description: '결론과 후속 연구',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/ether/kor/document/conclusion`,
        },
    },
    '/ether': {
        title: 'Ether',
        description: 'Hypothesis on the Spatial and Temporal Aspects of Matter',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/ether`,
        },
    },
    '/ether/document/hypothesis': {
        title: 'Hypothesis',
        description: 'Brief History of the Study',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/ether/document/hypothesis`,
        },
    },
    '/ether/document/classic-physics': {
        title: 'Proof(1): Classic Physics',
        description: "Ether from Bohr's Atomic Model",
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/ether/document/classic-physics`,
        },
    },
    '/ether/document/rydberg-formula': {
        title: 'Proof(2): Reinterpretation of Rydberg Formula',
        description: 'Rydberg Formula for Multi Electron Atoms',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/ether/document/rydberg-formula`,
        },
    },
    '/ether/document/analysis': {
        title: 'Proof(3): Emission Energy Analysis',
        description: 'Comparing with Actual Data',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/ether/document/analysis`,
        },
    },
    '/ether/document/between': {
        title: 'Proof(4): Between Comparison',
        description: 'Minimizing Margin',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/ether/document/between`,
        },
    },
    '/ether/document/conclusion': {
        title: 'Conclusion',
        description: 'For Further Study',
        keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
        openGraph: {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/ether/document/conclusion`,
        },
    },
}
