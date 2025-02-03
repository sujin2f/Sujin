import Link from 'next/link'
import { InlineMath } from 'react-katex'
/* Components */
import { Image } from '@common/components/containers/image'
import { Table } from '@common/components/containers/Table'
import { Latex } from '@components/wordpress/single/Latex'
import { PrevNext } from '@components/wordpress/single/PrevNext'
/* Helpers */
import type { Post } from '@src/types/wordpress'
import ScrollToTop from '@components/ScrollToTop'
/* Assets */
import pic9 from '@src/images/ether/pic9.png'
import pic10 from '@src/images/ether/pic10.png'
import pic55 from '@src/images/ether/pic55.png'
import pic56 from '@src/images/ether/pic56.png'
import pic57 from '@src/images/ether/pic57.png'
import pic58 from '@src/images/ether/pic58.png'
import pic59 from '@src/images/ether/pic59.png'
import pic92 from '@src/images/ether/pic92.jpeg'
import pic93 from '@src/images/ether/pic93.jpeg'
import pic94 from '@src/images/ether/pic94.png'
import pic95 from '@src/images/ether/pic95.png'
import pic113 from '@src/images/ether/pic113.png'
import 'katex/dist/katex.min.css'

export default function RydbergFormula() {
    return (
        <div className="ether" style={{ counterReset: 'fig 7 tbl 6 equ 2' }}>
            <ScrollToTop />

            <p>
                지금까지는 보어의 원자모형을 기준으로 가설을 검증했었다. 그러나
                보어 원자모형은 더 이상 유효하지 않다. 다전자 원자에서는
                성립하지 않으며, 실제 전자는 원형 궤도를 도는 존재가 아니다.
                양자물리학이 밝혀낸 것은 원자에 속한 전자가 에너지를 흡수해서
                오비탈이라는 형상(확률)으로 나타난다는 것이다. 오비탈 안에서
                전자는 활률적으로 존재한다.
            </p>

            <Image
                src={pic9}
                alt="전자 오비탈"
                caption={
                    <>
                        <strong>전자 오비탈</strong>{' '}
                        <Link
                            href="https://en.wikipedia.org/wiki/Atomic_orbital"
                            target="_blank"
                            rel="noreferrer"
                        >
                            출처: 위키피디아
                        </Link>
                    </>
                }
                center
            />

            <h2>가설: 오비탈의 마디는 광자-에테르</h2>

            <p>
                그림에서 검은 부분을 마디라고 부른다. 그 마디의 모양과 개수에
                따라 오비탈의 형태가 결정된다. 오비탈의 모양은 앞서 보어
                원자모형에서도 등장한 주양자수 <code>n</code>과 부양자수{' '}
                <code>l</code>, 그리고 자기양자수인{' '}
                <code>
                    m<sub>l</sub>
                </code>
                에 의해 결정된다. <code>n</code>의 증가는 보어 원자모형과 같이
                원형의 개수를 증가시킨다. <code>l</code>의 증가는 원형 하나가
                없어지면서 선형의 마디가 생겨난다. 자기양자수는 각도를 결정한다.
            </p>

            <p>
                원형의 마디를 가진 오비탈을 s 오비탈이라고 부른다. 마디가 없으면{' '}
                <code>1s</code>, 원형 마디가 하나일 때 <code>2s</code>
                이다. 선형의 마디를 하나 가진 오비탈을 <code>p</code>라고 한다.
                선형 하나면 <code>2p</code>, 선형 하나에 원형 하나면{' '}
                <code>3p</code>이다. 이런 식으로 선형의 마디 개수를 기준으로{' '}
                <code>d</code>, <code>f</code>, <code>g</code>와 같은 이름을
                가진다. 이제 마디를 광자-에테르라고 가정하고 오비탈을 다시
                해석해 보겠다.
            </p>

            <Image
                src={pic10}
                alt="에테르의 관점으로 본 오비탈"
                caption={
                    <>
                        <strong>에테르의 관점으로 본 오비탈</strong>
                        원형과 선형 에테르가 혼합되어 있는 형태
                    </>
                }
                center
            />

            <p>
                <code>n</code>의 증가는 에테르의 개수가 늘어나는 것을 의미하며,
                <code>l</code>의 증가는 원형이었던 에테르를 선형으로 변화시킨다.
                s 오비탈은 원형의 에테르만을 가지고 있으며, p 오비탈은 선형
                에테르 하나에 원형 에테르를 가진 것으로 해석할 수 있다.{' '}
                <code>1s</code>
                오비탈은 에테르를 가지지 않은 상태이며, <code>3p</code> 오비탈은
                원형 하나와 선형 하나를 가진 상태를 가진다는 것이다.
            </p>

            <p>
                이는 전자의 모양이 변화되는 것으로 이해되고 있으나, 에테르의
                관점에서는 저 검은 마디가 에테르이며, 전자의 에테르는 구형
                그대로를 유지하되 광자-에테르에 의해 공간이 분리된 것으로 이해할
                수 있다. 마치 이중슬릿 실험에서 전자의 에테르가 분리가 된 것처럼
                말이다. 그렇다면 전자-스파클은 전자-에테르의 형상에 맞추어
                분리된 공간 속에서 확률적으로 존재한다고 할 수 있다. 그렇게
                나타난 형상이 바로 오비탈인 것이다.
            </p>

            <Image
                src={pic92}
                alt="오비탈에서 마디의 모양"
                width="300"
                caption={
                    <>
                        <strong>오비탈에서 마디의 모양</strong>저 마디가
                        광자-에테르라면?
                    </>
                }
                center
            />

            <p>
                에테르의 관점을 더 잘 나타내기 위해 원과 선으로 표기법을
                정해보기로 하자. <code>[X]</code>는 <code>1s</code>,{' '}
                <code>[O]</code>는 <code>2s</code>, <code>[OO]</code>는{' '}
                <code>3s</code>를 의미한다. <code>[-]</code>는 <code>2p</code>,{' '}
                <code>[-O]</code>는 <code>3p</code>를, <code>[--O]</code>는{' '}
                <code>4d</code>를 의미하게 될 것이다. <code>[--OOOOO]</code>와
                같이 자릿수가 높아지면 가독성을 위해 <code>[2-5O]</code>와 같이
                나타내는 방식을 병행하겠다. 전자가 여러개일 때,{' '}
                <code>
                    1s<sup>2</sup>
                </code>
                는 <code>[X]2</code>,
                <code>
                    2s<sup>2</sup>
                </code>
                는 <code>[O]2</code>와 같이 표기하도록 하자. 아래 사용되는
                데이터는{' '}
                <Link
                    href="https://physics.nist.gov/PhysRefData/ASD/lines_form.html"
                    target="_blank"
                    rel="noreferrer"
                >
                    NIST에서 참조
                </Link>
                하였다.
            </p>

            <p>
                이를 통해 증명하고 싶은 것은 원형과 선형에 따라 쌓이는 패턴이
                존재한다는 것이다. 다전자 원자에서 값이 변하는 추이가 마치 수소
                원자와 같이 일정하며, 방출 에너지는 에테르의 합이라는 것을
                보이고 싶은 것이다. 그렇다면 그 추이를 설명할 수 있는 기준값이
                필요하다. 수소꼴 원자에서의 뤼드베리 방정식과 같은 것 말이다.
            </p>

            <p>
                먼저 수소와 헬륨에서 원형 에테르 값의 변화를 보자.{' '}
                <code>[X]</code>, <code>[O]</code>, <code>[OO]</code>과 같은
                변화이다.
            </p>

            <Image
                src={pic55}
                alt="수소와 헬륨의 원형 에테르"
                caption={
                    <>
                        <strong>수소와 헬륨의 원형 에테르</strong> 그래프는
                        뤼드베리 방정식, 오른쪽 상단이 헬륨이다.
                    </>
                }
                center
                width={600}
            />

            <p>
                그래프를 상하좌우로 이동 시키면 마치 겹칠 것 같이 생겼다. 다전자
                원자에서 뤼드베리 방정식을 쓰지 말라고 여기저기 씌여 있지만
                유혹을 참을 수 없다. 뤼드베리 방정식을 변형시키는 방식으로
                기준값 방정식을 만들어보겠다. 이 과정에서 오차 없이 완벽한
                방정식을 찾으면 훌륭한 성과이겠지만, 스포일러 경고!, 그 방법을
                찾지는 못했다. 다만 최대한 근사하는 방정식을 찾아보고자 한다.
            </p>

            <h2>그래프의 이동</h2>

            <Image
                src={pic56}
                alt="헬륨의 s, p 오비탈"
                caption="헬륨의 s, p 오비탈"
                center
                width={600}
            />

            <p>
                헬륨 원자의 오비탈의 변화를 통해 알아보겠다. 수소는 너무 오차가
                작아서 적절하지 않다. 각각의 색상은{' '}
                <code>
                    <sup>1</sup>S<sub>0</sub>
                </code>
                ,{' '}
                <code>
                    <sup>3</sup>S<sub>1</sub>
                </code>
                ,{' '}
                <code>
                    <sup>3</sup>P*
                    <sub>2</sub>
                </code>
                와 같은 항기호(Term Symbol)가 같은 s, p 오비탈들이다. 이 값들이
                뤼드베리 방정식이 좌우로 이동을 한 값이라 생각해보자. 그렇다면
                뤼드베리 방정식을 변형하여 각각의 그래프를 만들 수 있을 것이다.
                수렴값은 이온화 에너지 값을 이용하자. 수소의 이온화 에너지는{' '}
                <code>13.60676328</code>이다. 이는 그래프의 비율이 된다. 헬륨의
                이온화 에너지는 <code>24.58556828</code>이다. 이를 식으로
                표현하면 이와 같다. 앞으로 구하는 R방정식은 R위에 원소 번호와
                이온 번호를 쩜(.)으로 구분하여 아라비아 숫자로 표기하고,
                에테르나 오비탈의 경우는 그 밑에 표기하도록 하겠다.
            </p>

            <Latex caption="수소의 뤼드베리 방정식 (eV)">{` R^{1.1}(x) = 13.60676328 \\cdot (1 - \\dfrac{1}{(x + 1)^2}) `}</Latex>
            <Latex caption="헬륨의 뤼드베리 방정식 (eV)">{`R^{2.1}(x) = 13.60676328 \\cdot (1 - \\dfrac{1}{(x + 1)^2}) + 24.58556828 - 13.60676328`}</Latex>

            <p>
                헬륨의 높이에 맞추어 뤼드베리 방정식을 상하로 이동해준 것이다.
            </p>

            <Image
                src={pic57}
                alt="뤼드베리 방정식을 헬륨에 맞추어 상하이동한 그래프"
                caption="뤼드베리 방정식을 헬륨에 맞추어 상하이동한 그래프"
                center
                width={600}
            />

            <p>
                뭔가 근사하게 맞아 떨어지는 듯 보인다. 이제 좌우 이동을 해보자.
                그래프의 비율인 <code>13.60676328</code>는 <code>r</code>
                (radius)로, 상하 이동값인 <code>24.58556828 - 13.60676328</code>
                는 <code>s</code>(shift)로 좌우 이동값은 <code>k</code>로
                치환한다.
            </p>

            <Latex>{`w = r \\cdot (1 - \\dfrac{1}{(v + 1 + k)^2}) + s`}</Latex>

            <p>
                위 식에서 <code>w</code>를 <code>[O]</code>에테르의 에너지,{' '}
                <code>v</code>에 에테르의 번호인 <code>1</code>을 대입하면,
                첫번째 위치에 맞추어 그래프가 좌우 이동할 것이다. 그럼 좌우
                이동값 <code>k</code>에 관한 식으로 만들어 보자.
            </p>

            <Latex>{`w = r \\cdot (1 - \\dfrac{1}{(v + 1 + k)^2}) + s`}</Latex>
            <Latex>{`\\to \\dfrac{w - s}{r} = 1 - \\dfrac{1}{(v + 1 + k)^2}`}</Latex>
            <Latex>{`\\to 1 - \\dfrac{w - s}{r} = \\dfrac{1}{(v + 1 + k)^2}`}</Latex>
            <Latex>{`\\to \\dfrac{1}{1 - \\dfrac{w - s}{r}} = (v + 1 + k)^2`}</Latex>
            <Latex>{`\\to \\dfrac{1}{\\sqrt{1 - \\dfrac{w - s}{r}}} = v + 1 + k`}</Latex>
            <Latex>{`\\to k = \\dfrac{1}{\\sqrt{1 - \\dfrac{w - s}{r}}} - v - 1`}</Latex>
            <p>이를 최초의 식에 다시 대입해보자.</p>
            <Latex>{`R(x, r, s, v, w) = r \\cdot (1 - \\dfrac{1}{(x + 1 + \\dfrac{1}{\\sqrt{1 - \\dfrac{w - s}{r}}} - v - 1)^2}) + s`}</Latex>
            <Latex>{`\\to R(x, r, s, v, w) = r + s - \\dfrac{r}{(x + \\dfrac{1}{\\sqrt{1 - \\dfrac{w - s}{r}}} - v)^2}`}</Latex>
            <Latex>{`\\to R(x, r, s, v, w) = r + s - \\dfrac{r}{(x - v + \\dfrac{1}{\\sqrt{\\dfrac{r - w + s}{r}}})^2}`}</Latex>
            <Latex>{`\\to R(x, r, s, v, w) = r + s - \\dfrac{r}{(x - v + \\sqrt{\\dfrac{r}{r - w + s}})^2}`}</Latex>
            <p>
                여기서 <code>r+s</code>는 이온화 에너지와 동일한 그래프의
                고점이다. <code>r+s</code>를<code>p</code>(peak)로 표기해 보자.
            </p>
            <Latex caption="완성된 변형 뤼드베리 방정식.">{`R(x, r, p, v, w) = p - \\dfrac{r}{(x - v + \\sqrt{\\dfrac{r}{p - w}})^2}`}</Latex>

            <p>
                <code>r</code>은 그래프의 비율이며 같은 위상에 있는 수소꼴
                원자의 고점이다. 즉, 헬륨의 <code>r</code> 값은 수소와 같으며,
                Li II의 <code>r</code> 값은 He II와 같은 값이다. <code>p</code>
                는 그래프의 고점, 수렴값이며 이는 이온화 에너지와 동일하다. 값을
                대입해서 헬륨 I의 s, p 오비탈의 그래프를 그려보면 아래와 같다.
            </p>

            <Image
                src={pic58}
                alt="헬륨의 s, p 오비탈의 그래프"
                caption={
                    <>
                        <strong>헬륨의 s, p 오비탈의 그래프</strong> 아름답지
                        아니한가?
                    </>
                }
                center
                width={600}
            />

            <p>
                다른 예로 리튬의{' '}
                <code>
                    <sup>2</sup>S<sub>1/2</sub>
                </code>
                을{' '}
                <code>
                    1s<sup>2</sup>3s
                </code>
                인<code>[X]2[OO]</code>에 맞추어 방정식을 만들면 아래와 같다.
                수소의 <code>r</code>값<code>13.60676328</code>, 리튬의 이온화
                에너지 <code>s</code>값 <code>5.39114472</code>, 2번 자리에서의
                방출 에너지 <code>3.373129</code>를 대입하는 것이다.
            </p>

            <Latex>{`R^{3.1}_{2S.1/2}(x) = R(x, 13.60676328, 5.39114472, 2, 3.373129)`}</Latex>

            <Image
                src={pic59}
                alt="리튬 I의 s 오비탈의 그래프"
                caption={
                    <>
                        <strong>리튬의 s 오비탈의 그래프</strong> 얘도 아름답다
                    </>
                }
                center
                width={600}
            />

            <h2>좌우 이동 방법</h2>

            <p>
                이제 수식에 넣기만 하면 상하좌우로 이동할 것이다. 그런데, 어떤
                값을 어디를 기준으로 얼마나 이동해야 적절한 비교일까? 기준이
                되는 수식은 동일해야 적절하기 때문에 그래프를 계속 이동시킬 수는
                없다. 헬륨 오비탈의 값들을 보자.
            </p>

            <Table scroll>
                <thead>
                    <tr>
                        <th>
                            <sup>1</sup>S<sub>0</sub>
                        </th>
                        <th>[X][O]</th>
                        <th>[X][OO]</th>
                        <th>[X][OOO]</th>
                        <th>[X][OOOO]</th>
                        <th>[X][5O]</th>
                        <th>[X][6O]</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th></th>
                        <td>20.616</td>
                        <td>22.920</td>
                        <td>23.674</td>
                        <td>24.011</td>
                        <td>24.191</td>
                        <td>24.298</td>
                    </tr>
                </tbody>
                <thead>
                    <tr>
                        <th>
                            <sup>1</sup>P*<sub>1</sub>
                        </th>
                        <th>[X][-]</th>
                        <th>[X][-O]</th>
                        <th>[X][-OO]</th>
                        <th>[X][-OOO]</th>
                        <th>[X][1-4O]</th>
                        <th>[X][1-5O]</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th></th>
                        <td>21.218</td>
                        <td>23.087</td>
                        <td>23.742</td>
                        <td>24.046</td>
                        <td>24.211</td>
                        <td>24.311</td>
                    </tr>
                </tbody>
                <thead>
                    <tr>
                        <th>
                            <sup>1</sup>D<sub>2</sub>
                        </th>
                        <th></th>
                        <th>[X][--]</th>
                        <th>[X][--O]</th>
                        <th>[X][--OO]</th>
                        <th>[X][2-3O]</th>
                        <th>[X][2-4O]</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th></th>
                        <td></td>
                        <td>23.087</td>
                        <td>23.742</td>
                        <td>24.046</td>
                        <td>24.211</td>
                        <td>24.311</td>
                    </tr>
                </tbody>
            </Table>

            <p>
                비어있는 공간에는 무엇이 들어가야 적절할까? <code>[X][--]</code>{' '}
                이전에는 원형 오비탈이 존재하지 않는 값인 <code>[X][-]</code>를
                배치하자. 그렇다면 s 오비탈은 기준 그래프 쪽으로 동일하게 좌우
                이동을 시키고, 나머지는 p 오비탈의 좌우 이동값 만큼 이동시키면
                될 것이다.
            </p>

            <Image
                src={pic93}
                alt="헬륨 오비탈 값의 좌우 이동"
                caption="헬륨 오비탈 값의 좌우 이동"
            />

            <p>
                이렇게 한다면 모든 점들을 기준 그래프 쪽으로 정렬 시킬 수 있다.
                왜 값을 좌우 이동하는지 의아한 사람이 있을 것이다. 그러나 이는
                방정식의 좌우 이동과 완전히 동일한 개념이다. 방정식을 이동 시킨
                후에는 방정식과 점을 동시에 이동해서 하나의 기준 방정식으로
                만들어야 하나의 기준으로 모든 값을 비교하는 것이 가능하기
                때문이다. 이동 수식에 s 오비탈을 대입해서 이동값을 구해보자.
            </p>

            <Latex>{`k = \\dfrac{1}{\\sqrt{1 - \\dfrac{w - s}{r}}} - v - 1`}</Latex>
            <Latex>{`k = \\dfrac{1}{\\sqrt{1 - \\dfrac{w - (p - r)}{r}}} - v - 1`}</Latex>
            <Latex>{`k = \\dfrac{1}{\\sqrt{\\dfrac{r}{r} - \\dfrac{w - p + r}{r}}} - v - 1`}</Latex>
            <Latex>{`k = \\dfrac{1}{\\sqrt{\\dfrac{r - w + p - r}{r}}} - v - 1`}</Latex>
            <Latex>{`k = \\dfrac{1}{\\sqrt{\\dfrac{p - w}{r}}} - v - 1`}</Latex>
            <Latex>{`k = \\sqrt{\\dfrac{r}{p - w}} - v - 1`}</Latex>
            <Latex>{`\\to k_{s} = \\sqrt{\\dfrac{13.60676328}{24.58556828 - 20.6157751334}} - 1 - 1`}</Latex>
            <Latex caption="모든 점을 x축 방향으로 이만큼 옮겨주면 기준 뤼드베리 방정식에 붙을 것이다">{`\\to k_{s} = −0.148628918071`}</Latex>

            <Image src={pic113} alt="s, p, d의 배치" caption="s, p, d의 배치" />

            <p>
                s 오비탈은 값이 낮고 (그래프가 오른쪽), 선형 에테르가 포함된 p,
                d 등은 왼쪽에 모여있다. s를 제외한 다른 친구들은 바닥 상태의
                다음 상태인 <code>[-]</code>쪽으로 이동시키자.
            </p>

            <p>
                p 오비탈을 <code>[X][-]</code> 방향으로 이동한 k<sub>p</sub>값은{' '}
                <code>0.00897479319406</code>가 된다. 그럼 이들을 대입하여 표를
                다시 그려보자. 이번에는 값 대신 좌표로 표시하겠다.
            </p>

            <Table scroll>
                <thead>
                    <tr>
                        <th>
                            <sup>1</sup>S<sub>0</sub>
                        </th>
                        <th>[X][O]</th>
                        <th>[X][OO]</th>
                        <th>[X][OOO]</th>
                        <th>[X][OOOO]</th>
                        <th>[X][5O]</th>
                        <th>[X][6O]</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th></th>
                        <td>
                            (1+k<sub>s</sub>, 20.616)
                        </td>
                        <td>
                            (2+k<sub>s</sub>, 22.920)
                        </td>
                        <td>
                            (3+k<sub>s</sub>, 23.674)
                        </td>
                        <td>
                            (4+k<sub>s</sub>, 24.011)
                        </td>
                        <td>
                            (5+k<sub>s</sub>, 24.191)
                        </td>
                        <td>
                            (5+k<sub>s</sub>, 24.298)
                        </td>
                    </tr>
                </tbody>
                <thead>
                    <tr>
                        <th>
                            <sup>1</sup>P*<sub>1</sub>
                        </th>
                        <th>[X][-]</th>
                        <th>[X][-O]</th>
                        <th>[X][-OO]</th>
                        <th>[X][-OOO]</th>
                        <th>[X][1-4O]</th>
                        <th>[X][1-5O]</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th></th>
                        <td>
                            (1+k<sub>p</sub>, 21.218)
                        </td>
                        <td>
                            (2+k<sub>p</sub>, 23.087)
                        </td>
                        <td>
                            (3+k<sub>p</sub>, 23.742)
                        </td>
                        <td>
                            (4+k<sub>p</sub>, 24.046)
                        </td>
                        <td>
                            (5+k<sub>p</sub>, 24.211)
                        </td>
                        <td>
                            (6+k<sub>p</sub>, 24.311)
                        </td>
                    </tr>
                </tbody>
                <thead>
                    <tr>
                        <th>
                            <sup>1</sup>D<sub>2</sub>
                        </th>
                        <th></th>
                        <th>[X][--]</th>
                        <th>[X][--O]</th>
                        <th>[X][--OO]</th>
                        <th>[X][2-3O]</th>
                        <th>[X][2-4O]</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th></th>
                        <td></td>
                        <td>
                            (1+k<sub>p</sub>, 23.087)
                        </td>
                        <td>
                            (1+k<sub>p</sub>, 23.742)
                        </td>
                        <td>
                            (1+k<sub>p</sub>, 24.046)
                        </td>
                        <td>
                            (1+k<sub>p</sub>, 24.211)
                        </td>
                        <td>
                            (1+k<sub>p</sub>, 24.311)
                        </td>
                    </tr>
                </tbody>
            </Table>

            <p>이를 그래프에 얹으면 아래와 같다.</p>

            <Image
                src={pic94}
                alt="헬륨 오비탈 값의 좌우 이동 그래프"
                caption="헬륨 오비탈 값의 좌우 이동 그래프"
                center
                width={600}
            />

            <p>
                이 문서의 목적은 에테르가 쌓이는 것을 증명하는 것이다. 따라서
                전체 에너지 보다는 각 단계별로 변하는 에너지를 보아야 한다.{' '}
                <code>[X][O]</code>에서 <code>[X][OO]</code>로의 에너지 증가는
                두 값의 차이와{' '}
                <InlineMath>{`R(2+k_{s}) - R(1+k_{s})`}</InlineMath>를 비교해야
                할 것이다.
            </p>

            <Latex>{`a = 22.920317682 - 20.6157751334 = 2.3045425486`}</Latex>
            <Latex>{`b = R(2+k_{s}) - R(1+k_{s}) = 2.29784533694`}</Latex>
            <Latex>{`a - b = 0.00669721166409`}</Latex>
            <Latex
                caption={
                    <>
                        에너지 v<sub>2</sub> 에서 v<sub>1</sub>로 에너지가
                        방출될 때 변형 뤼드베리 방정식과의 차이 D(x)
                    </>
                }
            >{`\\to D(x) = v_2 - v_1 - (R(x+1+k_{2}) - R(x+k_{1}))`}</Latex>

            <p>같은 식으로 모든 값의 변화를 표로 나타내면 아래와 같다.</p>

            <Table scroll>
                <thead>
                    <tr>
                        <th>
                            <sup>1</sup>S<sub>0</sub>
                        </th>
                        <th>[OO] - [O]</th>
                        <th>[OOO] - [OO]</th>
                        <th>[OOOO] - [OOO]</th>
                        <th>[5O] - [OOOO]</th>
                        <th>[6O] - [5O]</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th></th>
                        <td>0.00669721166409</td>
                        <td>−0.00322123849668</td>
                        <td>−0.00157668275873</td>
                        <td>−0.00076388060241</td>
                        <td>−0.000401501193807</td>
                    </tr>
                </tbody>
                <thead>
                    <tr>
                        <th>
                            <sup>1</sup>P*<sub>1</sub>
                        </th>
                        <th>[-O] - [-]</th>
                        <th>[-OO] - [-O]</th>
                        <th>[-OOO] - [-OO]</th>
                        <th>[1-4O] - [-OOO]</th>
                        <th>[1-5O] - [1-4O]</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th></th>
                        <td>0.00163108806923</td>
                        <td>−0.000784728358325</td>
                        <td>-0.00038084816397</td>
                        <td>−0.000180879400757</td>
                        <td>−0.0000924805841381</td>
                    </tr>
                </tbody>
                <thead>
                    <tr>
                        <th>
                            <sup>1</sup>D<sub>2</sub>
                        </th>
                        <th></th>
                        <th>[--O] - [--]</th>
                        <th>[--OO] - [--O]</th>
                        <th>[2-3O] - [--OO]</th>
                        <th>[2-4O] - [2-3O]</th>
                        <th>[2-5O] - [2-4O]</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th></th>
                        <td></td>
                        <td>0.00642397109168</td>
                        <td>0.00235719100603</td>
                        <td>0.00106323196224</td>
                        <td>0.000549605285862</td>
                        <td>0.000312953223304</td>
                    </tr>
                </tbody>
            </Table>

            <p>이를 그래프에 옮겨 보자.</p>

            <Image
                src={pic95}
                alt="헬륨 오비탈 값의 변화"
                caption="헬륨 오비탈 값의 변화"
                center
                width={600}
            />

            <p>
                이렇게 하면 측정된 모든 값의 차이인 에너지 변화를 동일한
                기준으로 비교할 수 있다. 값도 들쭉날쭉 하지 않아 하나의 그래프에
                나타내기 매우 좋아 보인다. 오차도 매우 작다. 언제 보아도
                사랑스럽다. 다음 장에서는 실제 비교와 해석을 통하여 원자의 방출
                에너지를 에테르가 쌓이는 것으로 볼 수 있을지 알아보고자 한다.
            </p>

            <PrevNext
                prevNext={{
                    prev: {
                        title: '가설의 검증(1): 고전 물리학',
                        link: '/ether/kor/document/classic-physics',
                    } as Post,
                    next: {
                        title: '가설의 검증(3): 방출 에너지 분석',
                        link: '/ether/kor/document/analysis',
                    } as Post,
                }}
            ></PrevNext>
        </div>
    )
}
