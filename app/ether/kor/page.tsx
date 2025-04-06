/* Components */
import ScrollToTop from '@common/components/ScrollToTop'
import { PrevNext } from '@app/(single)/_components/PrevNext'
/* Types */
import type { PostType } from '@app/_lib/data/mysql/types'

export default function Intro() {
    return (
        <>
            <ScrollToTop />
            <p>
                질량 전자기파 합성체로서의 물질과 질량 독립적 전자기파로서의
                광자, 그리고 전자기파 독립적 질량.
            </p>

            <p>since 2024 수진</p>

            <h2>요약</h2>

            <p>
                본 문서는 물질의 구조에 대한 새로운 가설을 제시하고자 한다.
                제시할 가설에 따르면 물질은 질량을 이루고 있는 공간과 전자기파의
                성질을 가진 입자/파동으로 나눌 수 있다. 전자와 같은 물질이
                공간과 입자/파동의 합성체라면, 광자는 공간이 없는 입자/파동이라
                가정한다.
            </p>

            <p>
                이를 증명하기 위해 본 문서에서는 입자/파동이 없는 질량 공간의
                존재를 탐구하도록 하겠다. 이를 위해 보어 모델과 오비탈을
                재해석할 것이다. 물질을 공간과 입자/파동의 관점에서 봤을 때
                존재하는 현상을 더 간단히 설명할 수 있다면 가설에 대한 작은
                가능성을 제시할 수 있을 것이다.
            </p>

            <p>
                본 문서를 작성한 사람은 비전공자이다. 나는 이것이 과학적으로
                얼마나 명징할지 구분할 수 있는 능력이 없다. 본 문서는 나와 같은
                비전공자들도 이해할 수 있도록 최대한의 설명을 곁들여 작성했기
                때문에 설명이 매우 장황할 수 있다는 것을 밝힌다.
            </p>

            <PrevNext
                posts={[
                    ,
                    {
                        title: '가설 제시',
                        link: '/ether/kor/document/hypothesis',
                    } as PostType,
                ]}
            ></PrevNext>
        </>
    )
}
