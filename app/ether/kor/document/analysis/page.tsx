import Link from 'next/link'
import { InlineMath } from 'react-katex'
/* Components */
import { NextImage } from '@common/components/containers/NextImage'
import Table from '@common/components/containers/Table'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { Latex } from '@app/(single)/_components/Latex'
import { PrevNext } from '@app/(single)/_components/PrevNext'
import Wrapper from '@app/ether/wrapper'
import { MENU_NAMES } from '@app/_lib/types'
/* Assets */
import pic29 from '@app/_lib/images/ether/pic29.png'
import pic42 from '@app/_lib/images/ether/pic42.png'
import pic65 from '@app/_lib/images/ether/pic65.png'
import pic86 from '@app/_lib/images/ether/pic86.png'
import pic96 from '@app/_lib/images/ether/pic96.png'
import pic97 from '@app/_lib/images/ether/pic97.png'
import pic98 from '@app/_lib/images/ether/pic98.png'
import pic99 from '@app/_lib/images/ether/pic99.png'
import pic100 from '@app/_lib/images/ether/pic100.png'
import pic101 from '@app/_lib/images/ether/pic101.png'
import pic102 from '@app/_lib/images/ether/pic102.png'
import pic103 from '@app/_lib/images/ether/pic103.png'
import pic104 from '@app/_lib/images/ether/pic104.png'
import pic105 from '@app/_lib/images/ether/pic105.png'
import pic106 from '@app/_lib/images/ether/pic106.png'
import pic107 from '@app/_lib/images/ether/pic107.png'
import pic108 from '@app/_lib/images/ether/pic108.png'
import pic109 from '@app/_lib/images/ether/pic109.png'
import pic110 from '@app/_lib/images/ether/pic110.png'
import pic111 from '@app/_lib/images/ether/pic111.png'
import pic112 from '@app/_lib/images/ether/pic112.png'
import 'katex/dist/katex.min.css'

export default function Analysis() {
    return (
        <Wrapper
            menu={MENU_NAMES.ETHER_KOR}
            style={{ counterReset: 'fig 19 tbl 6 equ 7' }}
        >
            <p>
                공식이 준비되었다. 비교에 들어가보자. 이전 장의 마지막 그래프를
                약간 보완해서 다시 가져오겠다.
            </p>

            <NextImage
                src={pic96}
                alt="헬륨 오비탈 값의 변화"
                caption="헬륨 오비탈 값의 변화"
                width={600}
                center
            />

            <p>
                0 자리는 바닥 상태에서 첫번째 에테르가 등장하는 지점이다. 좌우
                이동을 한 기준이 첫번째 에테르이기 때문에 값의 차이를 0으로
                설정해도 문제는 없다. 또한 d 오비탈인 보라색의 1 자리가 추가
                되었다. 파란 색은 s, 초록 색은 p 오비탈이다. s 오비탈인 파란색의
                값은 모두 원형 에테르가 늘어나는 변화이다. p 오비탈인 초록색의
                첫번째 값인 0은 <code>[X]</code>에서 <code>[-]</code>가 되는
                변화이며, 나머지는 원형 에테르가 늘어나는 변화이다. 마지막으로 d
                오비탈인 보라색 역시 첫번째 값은 선형 에테르가 증가하고 나머지는
                원형 에테르가 증가하는 값이다.
            </p>

            <p>
                s와 p 오비탈에서 원형 에테르의 증가는 처음에 값이 치솓았다가 뚝
                떨어졌다 다시 올라가면서 수렴점으로 수렴하는 것 처럼 보인다.
                그러나 d는 패턴이 다르다. 오차일 수 있다. 수렴점으로 잘 가고
                있지 않은가? 아직 희망을 버리기에는 이르다.
            </p>

            <NextImage
                src={pic97}
                alt="헬륨 오비탈 값의 변화 + 선형 에테르"
                caption="헬륨 오비탈 값의 변화 + 선형 에테르"
                width={600}
                center
            />

            <p>
                추가된 붉은 선은 선형 에테르의 개수 변화를 보여준다.{' '}
                <code>[X]</code>, <code>[-]</code>, <code>[--]</code>,{' '}
                <code>[---]</code>이다. 분명 다른 값들은 원형 에테르의 개수
                변화인데, d 오비탈은 선형 에테르의 변화와 일치한다. 원형과
                선형의 쌓임이 방출 에너지를 결정한다면 원형은 원형의 패턴을
                가지고 선형은 선형의 패턴을 가져야 한다. 그래야 덧셈이다.
                망했다. 가설은 깨졌다. 안녕히 계세요 여러분.
            </p>

            <h2>원이 먼저인가, 선이 먼저인가?</h2>

            <p>
                여기서 잠깐 의문을 하나 제기해 본다. <code>[-O]</code>와{' '}
                <code>[O-]</code> 중에 여러분은 어떤 것이 맞는 것 같은가? 그게
                무슨 상관이냐고 하시는 분들도 있을 것이고, 나와 같이 앞의 것이
                맞다고 생각하는 사람도 있을 것이다. 앞의 것이 맞다고 생각하는
                사람들은 오비탈의 분류가 선형 에테르의 개수를 기준으로 하기
                때문일 것이다. 예를 들자면, p 오비탈이 <code>[-]</code>,{' '}
                <code>[-O]</code>, <code>[-OO]</code>로 변화하기 때문에
                습관적으로 선형을 앞에 두게된다. 그런데 이것을 <code>[O-]</code>
                라고 생각하면 의미가 완전히 달라진다.
            </p>

            <p>
                첫번째 자리에 있는 에테르는 값이 아주 크다. 반면 두 번째 자리의
                것은 상대적으로 작다. 원형과 선형의 에테르는 값이 다르다. 이
                세가지를 조합하면 <code>[-O]</code>과 <code>[O-]</code>의 값은
                다를 수 밖에 없다. 그것이 덧셈이라면 말이다. <code>[O]</code>가
                10이고 <code>[-]</code>가 11, <code>[O-]</code>가 12라 가정해
                보자. 선형이 우선이라면 <code>[-O]</code>에서 원형은 1일 것이고,
                원형이 우선이라면 두번째 위치 <code>[O-]</code>에서 선형은 2가
                될 것이다. 그러니 무엇이 먼저 쌓이는지는 매우 중요하다 할 수
                있다.
            </p>

            <p>
                <code>[X]</code> =&gt; <code>[O]</code> =&gt; <code>[OO]</code>{' '}
                =&gt; <code>[OOO]</code> =&gt; <code>[OOOO]</code> 이것은 s
                오비탈이며 원형 에테르이다. <code>[X]</code> =&gt;{' '}
                <code>[-]</code> =&gt; <code>[--]</code> =&gt;{' '}
                <code>[---]</code> =&gt; <code>[----]</code> 이것은 선형
                에테르이며 <code>1s</code> =&gt; <code>2p</code> =&gt;{' '}
                <code>3d</code> =&gt; <code>4f</code>로 변화한다.{' '}
                <code>[O]</code> =&gt; <code>[O-]</code> =&gt;{' '}
                <code>[O--]</code> =&gt; <code>[O---]</code> 이것은 원형 하나
                위에 선형들이 쌓이는 것으로 <code>2s</code> =&gt;{' '}
                <code>3p</code> =&gt; <code>4d</code> =&gt; <code>5f</code>가
                되는 값이다.
            </p>

            <p>값들을 재정렬하자.</p>

            <NextImage
                src={pic98}
                alt="원형이 먼저다"
                caption="원형이 먼저다!"
                width={600}
                center
            />

            <p>
                푸른 선은 이전과 같이 s 오비탈이다. 원형의 개수가 늘어나는
                패턴이다. 붉은 선 역시 이전과 같은 선형 에테르의 개수 변화이다.
                초록색은 원형 하나가 고정되고 선형이 늘어나는 값들의 변화이다.
                즉, 푸른 선은 원형의 변화, 나머지는 선형의 변화이다. 보이는가
                휴먼? 이 아름다운 패턴이? 원형을 먼저 배치하는 방법이 더 나은
                패턴을 보여준다. s, p, d와 같이 선형 에테르의 개수를 기준으로
                하는 오비탈 분류법은 틀렸을 가능성이 있다.
            </p>

            <p>
                헬륨이라는 한정적인 상황에서 힌트가 잡혔다. 과연 이는 모든
                원자에 적용할 수 있을까? 만들어 보면 된다. 나 개발자 아닌가?
            </p>

            <p>
                그래서{' '}
                <Link
                    href="/ether/data/ether/2/1"
                    target="_blank"
                    rel="noreferrer"
                >
                    만들었다
                </Link>
                .
            </p>

            <p>
                선형을 우선으로 하는 기존의 오비탈 분류와 구분하여 원형을
                우선으로 하는 분류를 에테르 분류라 표기하겠다.
            </p>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic100}
                        alt="헬륨 오비탈 값의 변화"
                        caption="헬륨 오비탈 값의 변화"
                        width={600}
                    />
                </Column>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic99}
                        alt="헬륨 에테르 값의 변화"
                        caption="헬륨 에테르 값의 변화"
                        width={600}
                    />
                </Column>
            </Row>

            <h2>
                <Link
                    href="/ether/data/ether/1/1"
                    target="_blank"
                    rel="noreferrer"
                >
                    수소
                </Link>
            </h2>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic102}
                        alt="수소 오비탈 값의 변화"
                        caption="수소 오비탈 값의 변화"
                        width={600}
                    />
                </Column>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic101}
                        alt="수소 에테르 값의 변화"
                        caption="수소 에테르 값의 변화"
                        width={600}
                    />
                </Column>
            </Row>

            <p>
                안타깝게도 수소는 별 변별력이 없다. 첫번째, 수소는 기존의
                뤼드베리 방정식으로도 워낙 오차가 작기 때문이다. 두번째 이유는
                내가 사용한 r값(수소에서 그래프의 높이)은{' '}
                <Link
                    href="https://github.com/Bowserinator/Periodic-Table-JSON"
                    target="_blank"
                    rel="noreferrer"
                >
                    이곳에서 가져온
                </Link>{' '}
                이온화 에너지 값인데, 야주 약간의 오차가 있다. 이것은 모든 원자
                역시 마찬가지인데, 다만 수소는 워낙 오차가 너무 작아서 0.0001
                만으로도 그래프가 휙휙 바뀌게 된다.
            </p>

            <p>
                그렇다고 퉁 치고 넘어갈 수는 없다. 수소의 r값은 많은 원자에서
                그래프의 비율로 사용되는 값이기 때문이다. 보정을 하자. 가져온
                값은 <code>1312 J</code>인데, 삽질을 조금 해서{' '}
                <code>13.5984355 eV</code>를 얻었다. 이 값을 적용시켜 다시
                그래프를 그려 보았다.
            </p>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic103}
                        alt="수소 오비탈 값의 변화"
                        caption={
                            <>
                                수소 오비탈 값의 변화 <sup>2</sup>S
                                <sub>1/2</sub>
                            </>
                        }
                        width={600}
                    />
                </Column>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic104}
                        alt="수소 에테르 값의 변화"
                        caption={
                            <>
                                수소 에테르 값의 변화 <sup>2</sup>S
                                <sub>1/2</sub>
                            </>
                        }
                        width={600}
                    />
                </Column>
            </Row>

            <p>
                아직 변별력이 부족하다. 뤼드베리 방정식은 뒤로 갈 수록 변화가
                감소하는 로그함수와 비슷한 모습이다. 당연히 뒤로 갈 수록
                그래프가 모이면서 변화를 보기 힘들다. 그 간극을 조금 넓히고자
                수식을 아주 조금만 변형하도록 하겠다.
            </p>

            <Latex
                caption={
                    <>
                        에너지 v<sub>2</sub> 에서 v<sub>1</sub>로 에너지가
                        방출될 때 변형 뤼드베리 방정식과의 차이 D(x)
                    </>
                }
            >{`D(x) = v_2 - v_1 - (R(x+1+k_{2}) - R(x+k_{1}))`}</Latex>
            <p></p>
            <Latex>{`D(x) = \\dfrac{v_2 - v_1 - (R(x+1+k_{2}) - R(x+k_{1}))}{R(x+1+k_{2}) - R(x+k_{1})} `}</Latex>
            <Latex caption="뒤로 갈 수록 가중치를 주어 보기 편하게 만든 결과 D(x)">{`D(x) = \\dfrac{v_2 - v_1}{ R(x+1+k_{2}) - R(x+k_{1}) } - 1`}</Latex>

            <NextImage
                src={pic105}
                alt="가중치 D(x)를 사용한 수소 에테르 값의 변화"
                caption={
                    <>
                        가중치 D(x)를 사용한 수소 에테르 <sup>2</sup>S
                        <sub>1/2</sub> 값의 변화
                    </>
                }
                width={600}
                center
            />

            <p>조금 더 보기 편해졌으니 이 수식을 고정적으로 사용하기로 한다.</p>

            <h2>
                <Link
                    href="/ether/data/ether/1/1"
                    target="_blank"
                    rel="noreferrer"
                >
                    헬륨
                </Link>
            </h2>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic112}
                        alt="헬륨 오비탈 값의 변화"
                        caption={
                            <>
                                헬륨 오비탈 <sup>1</sup>S<sub>0</sub> 값의 변화
                            </>
                        }
                        width={600}
                    />
                </Column>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic99}
                        alt="헬륨 에테르 값의 변화"
                        caption={
                            <>
                                헬륨 에테르 <sup>1</sup>S<sub>0</sub> 값의 변화
                            </>
                        }
                        width={600}
                    />
                </Column>
            </Row>

            <p>
                헬륨은 본 페이지의 초반에 제시한 그래프(원형이 먼저다)와 동일한
                것이다. 다만 가중치 D(x)를 써서 규칙성이 더 강조된 것이다.
                여전히 오비탈에서는 패턴이 없으며 에테르에서는 패턴을 볼 수
                있다.
            </p>

            <h2>
                <Link
                    href="/ether/data/ether/3/1"
                    target="_blank"
                    rel="noreferrer"
                >
                    리튬
                </Link>
            </h2>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic106}
                        alt="리튬 오비탈 값의 변화"
                        caption={
                            <>
                                리튬 오비탈 <sup>2</sup>S<sub>1/2</sub> 값의
                                변화
                            </>
                        }
                        width={600}
                    />
                </Column>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic107}
                        alt="리튬 에테르 값의 변화"
                        caption={
                            <>
                                리튬 에테르 <sup>2</sup>S<sub>1/2</sub> 값의
                                변화
                            </>
                        }
                        width={600}
                    />
                </Column>
            </Row>

            <p>
                리튬의 오비탈 변화는 원래 저 지경 까지는 아닌데 가중치 D(x)가
                뒤로 갈 수록 차이를 강조하기 때문일 것이다. 그럼에도 리튬에서도
                동일한 패턴을 확인할 수 있다. 다만 원자 번호가 늘어날 수록 어떤
                Configuration이 함께 묶일 수 있는 것인지를 비전공자인 내가 잘
                판단할 수 없어서 더 좋을 자료를 만들지 못함에는 아쉬운 바이다.
            </p>

            <h2>리튬 이상의 원자들의 바닥 값에 대한 분석</h2>

            <p>
                수소가 그리는 곡선은 뤼드베리 방정식에 잘 대입이 된다. 헬륨은
                그래프의 고점이 올라가며 값들이 그 올라가는 값에 맞추어 함께
                올라간다. 그런데 리튬 부터는 내려가며 이후로는 들쭉 날쭉이다.
                이는 무엇 때문일까? 우선 수소꼴 원자, 헬륨꼴 원자의 첫번째 원형
                에테르 값들을 보자. eV는 에너지를 구하기에 적절하지만
                직관적이지는 못하기에 Rydberg 값으로 표시하였다.
            </p>

            <Table caption="원형 에테르 하나의 값">
                <thead>
                    <tr>
                        <th></th>
                        <th>H</th>
                        <th>He</th>
                        <th>Li</th>
                        <th>Be</th>
                        <th>B</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>I</th>
                        <td>0.7496</td>
                        <td>1.5152</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>II</th>
                        <td></td>
                        <td>2.9997</td>
                        <td>4.4777</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>III</th>
                        <td></td>
                        <td></td>
                        <td>6.7501</td>
                        <td>8.9412</td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>IV</th>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>12.0013</td>
                        <td>18.7540</td>
                    </tr>
                </tbody>
            </Table>

            <p>
                놀랍게도 근사값이 근사하게 떨어진다. <code>0.75</code>,{' '}
                <code>1.5</code>, <code>3</code>, <code>4.5</code>,
                <code>6.75</code>, <code>9</code>, <code>12</code>,{' '}
                <code>18.75</code>. 전부 0.75의 배수들이다. 0.75는 뤼드베리
                방정식에서 x가 1일 때의 값이기도 하다. 그럼 각각은 0.75의 몇
                배일까?
            </p>

            <NextImage
                src={pic29}
                alt="0.75의 몇 배일까?"
                caption={
                    <>
                        <strong>0.75의 몇 배일까?</strong>: 붉은색은 측정 값,
                        푸른색은 예측값
                    </>
                }
                width={600}
                center
            />

            <p>
                일단 붉은 글씨만을 먼저 보기로 하자. 첫번째 대각선 값들은 모두
                1, 4, 9, 16으로 Z의 제곱과 일치한다. 뤼드베리 방정식에서 원자
                번호가 올라가는 것을 Z의 제곱으로 표현한다. 가로 방향의 변화를
                대각선으로 보면 +1, +2, +3, +4로 역시 일정하다. 수소와 헬륨의
                차이에서 상하 이동인 s값과 같은 것으로 이해할 수 있다. 세로
                방향의 변화 역시 +2, +3, +4로 일정하다. 0.75의 정수배로 값의
                변화를 예측할 수 있을 것만 같다. Li I이 3, Be I이 4일 수 있다는
                것이다. 그렇게 가정하고 세로 방향의 변화를 보면 리튬은{' '}
                <InlineMath>{`\\begin{bmatrix}+3\\\\+3\\end{bmatrix}`}</InlineMath>
                , 베릴륨은{' '}
                <InlineMath>{`\\begin{bmatrix}+4\\\\+4\\\\+4\\end{bmatrix}`}</InlineMath>
                가 되는 것을 볼 수 있다. 한 가지 가능성이 더 있는데, 가로축
                변화량을
                <InlineMath>{`\\begin{bmatrix}+1 & +2 & +3 & +4 & ...\\end{bmatrix}`}</InlineMath>
                로 가정하는 것이다. 그렇게 하면 세로 방향의 변화는{' '}
                <InlineMath>{`\\begin{bmatrix}+2\\\\+3\\end{bmatrix}`}</InlineMath>
                과 같이 1씩 증가한다. 두 가지 가능성 중에서 더 설득력이 있는
                것은 첫번째 것이다. <code>[X]</code>의 수가 상하 이동에 미치는
                영향이 0.75로 일정해지기 때문이다. 수소는 <code>[X]</code>가
                없기 때문에 고점이 0.75이다. 헬륨은 0.75에 <code>[X]</code>{' '}
                하나의 영향 0.75를 더해 1.5가 된다. 리튬은 0.75에{' '}
                <code>[X]</code> 두 개의 영향 1.5를 더해 2.25가 되는 것이다. 더
                단순한 설명이 진실일 것이라는 오컴의 면도날을 따르자. 이를
                도해하면 아래와 같다.
            </p>

            <NextImage
                src={pic42}
                alt="상하 이동의 예측"
                caption="상하 이동의 예측"
                width={600}
                center
            />

            <NextImage
                src={pic65}
                alt="가설에 따라 리튬 그래프를 만들고 리튬의 점들을 이동시킨 결과"
                caption={
                    <>
                        <strong>
                            가설에 따라 리튬 그래프를 만들고 리튬의 점들을
                            이동시킨 결과
                        </strong>{' '}
                        이게 아름답지 않다고?
                    </>
                }
                width={600}
                center
            />

            <p>
                리튬의 바닥 상태는 <code>[X]2[O]</code>이다. 저 마지막{' '}
                <code>[O]</code>은 <code>[X]</code>가 될 수 없다. 다전자
                원자에서의 쌓음 원리 때문이다. 따라서 리튬의 바닥 상태는 사실상
                바닥 상태 까지 x축이 위로 이동했다고 볼 수 있다. 이 경우에도
                뤼드베리 방정식을 적용 가능하다는 것을 보이는 바이다.
            </p>

            <h2>
                <Link
                    href="/ether/data/ether/4/1"
                    target="_blank"
                    rel="noreferrer"
                >
                    베릴륨
                </Link>
            </h2>

            <Row>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic108}
                        alt="베릴륨 오비탈 값의 변화"
                        caption={
                            <>
                                베릴륨 오비탈 <sup>1</sup>S<sub>0</sub> 값의
                                변화
                            </>
                        }
                        width={600}
                    />
                </Column>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic109}
                        alt="베릴륨 에테르 값의 변화"
                        caption={
                            <>
                                베릴륨 에테르 <sup>1</sup>S<sub>0</sub> 값의
                                변화
                            </>
                        }
                        width={600}
                    />
                </Column>
            </Row>

            <p>
                베릴륨 역시도 아름답다. 리튬에서 처럼 약간 다른 이야기를 해보자.
                베릴륨도 리튬 처럼 &lsquo;원래대로&rsquo; 그래프를 이동시키는
                것이 가능할까? 답은 &lsquo;가능은 한데 어렵다&rsquo;이다.
            </p>

            <p>
                베릴륨의 바닥 상태는 <code>[X]2[O]2</code>이다. 원형 오비탈이 두
                개나 들어왔다. <code>[X]</code>가 두 개 있으니 상하이동은 리튬과
                같다고 하자. 그런데 <code>[O]</code> 두 개는 과연 어떤 영향을
                미칠까? 이를 추론하기 위해 헬륨과 리튬에서 에테르가 두 개일
                경우를 볼 수 있다.
            </p>

            <p>
                헬륨의 <code>[X][O]</code>의 eV 값은 20.6157751334이며 고점은
                24.58732518이다. 그런데 <code>[O][-]</code>는 58.311이나 된다.
                리튬도 마찬가지다. 바닥 상태 다음 값인 <code>[X]2[OO]</code>는
                3.373129인데 <code>[X][O][-]</code>는 57.469이다. 에테르 두 개가
                존재하는 경우 값이 엄청 튀어오르는 것이다. 따라서 베릴륨의 바닥
                상태는 <code>[X]</code> 두 개가 일으키는 상하이동과{' '}
                <code>[O]</code> 두 개의 상하이동 모두를 이해해야 알아낼 수
                있다.
            </p>

            <Row fullWidth>
                <Column small={4}></Column>
                <Column small={3}>
                    <NextImage
                        src={pic86}
                        alt="리튬의 에너지 분포"
                        width={600}
                    />
                </Column>
            </Row>

            <p>
                <strong>리튬의 에너지 분포</strong> 저 위에 있는 별자리들의
                규칙을 알아야 베릴륨을 풀어낼 수 있을 것이다
            </p>

            <p>
                베릴륨 이상의 상태는 더 많은 탐구가 있어야만 풀어낼 수 있을
                것이다. 다만, 여기서 말하고 싶은 것은 그 역시 뤼드베리 방정식에
                기반할 것이라는 예측이다. 왜? 베릴륨의 그래프 역시 아름답기
                때문이다.
            </p>

            <h2>
                <Link
                    href="/ether/data/ether/11/1"
                    target="_blank"
                    rel="noreferrer"
                >
                    소디움
                </Link>{' '}
                (우리 땐 나트륨이라고)
            </h2>

            <p>
                마지막으로 소디움을 보겠다. 보론에서 네온 까지는 앞서 밝혔듯
                비전공자의 한계 때문에 값들을 정확히 분류해 내는 것이 매우
                어렵다. 다만{' '}
                <Link
                    href="/ether/data/ether/8/1"
                    target="_blank"
                    rel="noreferrer"
                >
                    산소
                </Link>
                의 대략적인 모습을 보면 값을 제대로 배치만 한다면 역시 패턴을
                보여줄 수 있으리라 기대한다.
            </p>

            <p>
                공교롭게도 베릴륨 이후에 패턴을 명확하게 볼 수 있는 원자가
                소디움이다.{' '}
                <Link
                    href="https://www.google.com/search?q=periodic+table"
                    target="_blank"
                    rel="noreferrer"
                >
                    주기율표
                </Link>
                에서 수소와 같은 족에 있는 친구이다. 껍질에 원형이 우선 배치되는
                같은 종류의 친구이다.
            </p>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic110}
                        alt="소디움 오비탈 값의 변화"
                        caption={
                            <>
                                소디움 오비탈 <sup>2</sup>S<sub>1/2</sub> 값의
                                변화
                            </>
                        }
                        width={600}
                    />
                </Column>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic111}
                        alt="소디움 에테르 값의 변화"
                        caption={
                            <>
                                소디움 에테르 <sup>2</sup>S<sub>1/2</sub> 값의
                                변화
                            </>
                        }
                        width={600}
                    />
                </Column>
            </Row>

            <PrevNext
                prev={{
                    title: '가설의 검증(2): 뤼드베리 방정식의 재정립',
                    link: '/ether/kor/document/rydberg-formula',
                }}
                next={{
                    title: '가설의 검증(4): 비교기준, Between',
                    link: '/ether/kor/document/between',
                }}
            ></PrevNext>
        </Wrapper>
    )
}
