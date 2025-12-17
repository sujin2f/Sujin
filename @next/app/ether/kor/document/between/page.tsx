import Link from 'next/link'
import { InlineMath } from 'react-katex'
/* Components */
import { NextImage } from '@common/components/containers/NextImage'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import { Latex } from '@app/blog/_components/Latex'
import { PrevNext } from '@app/blog/_components/PrevNext'
/* Assets */
import pic58 from '@lib/images/ether/pic58.png'
import pic114 from '@lib/images/ether/pic114.png'
import pic115 from '@lib/images/ether/pic115.png'
import pic116 from '@lib/images/ether/pic116.png'
import pic117 from '@lib/images/ether/pic117.png'
import pic118 from '@lib/images/ether/pic118.png'
import pic119 from '@lib/images/ether/pic119.png'
import pic120 from '@lib/images/ether/pic120.png'
import pic121 from '@lib/images/ether/pic121.png'
import pic122 from '@lib/images/ether/pic122.png'
import pic123 from '@lib/images/ether/pic123.png'
import pic125 from '@lib/images/ether/pic125.png'
import 'katex/dist/katex.min.css'

export const metadata = {
    title: '가설의 검증(4): 비교 기준, Between',
    description: '오차 보정',
    keywords: ['Quantum Physics', 'Theory', 'Hypothesis'],
    openGraph: {
        url: `${process.env.NEXT_BASE_URL}/ether/kor/document/between`,
    },
}

export default function Between() {
    return (
        <div style={{ counterReset: 'fig 40 tbl 7 equ 9' }}>
            <p>
                여기서 하나 의문이 생긴다. 원형 에테르의 변화를 s 오비탈 쪽으로, 나머지를 p 오비탈 쪽으로 이동시킨 후
                비교하는 것이 과연 적당했을까? 선형이 포함된 변화를 서로 모으면 그들만의 패턴이 나타나는 것일 수 있지
                않을까? 조금 더 객관적인 비교가 필요할 것 같다. 다시 헬륨에서의 값들의 배치를 보자.
            </p>

            <NextImage
                src={pic58}
                alt="헬륨의 s, p 오비탈의 그래프"
                caption="헬륨의 s, p 오비탈의 그래프"
                width={600}
                center
            />

            <p>
                이전 장에서는 원형만 가진 s 오비탈을 한 기준으로 옮기고, 선형을 가진 나머지를 p 오비탈 쪽으로
                이동시켰다. 새롭게 제시할 기준은 이 두 지점으로 옮긴 그래프를 좌표로 만드는 것이다. <code>[O]</code>로
                옮긴 그래프를 0으로, <code>[-]</code>의 그래프를 100으로 잡았을 때 점의 위치를 표시하는 것이다. 위
                그림에서 가장 위의 보라색 선을 100, 가장 아래의 붉은 점을 0으로 놓고 그 사이에서 점들이 어떻게
                움직이는지 보는 것이다. 이 방식을 사용하면 모든 점을 한 가지 기준으로 정렬 시킬 수 있을 것이다. 이것을
                Between이라 부르고, 앞서 것을 Transform이라 부르기로 허자.
            </p>

            <p>
                그런데, 위 그림을 그대로 사용할 수 없다. 우리가 알고자 하는 것은 점의 위치가 아니라 이전 값에서 얼마나
                변하였는지를 보는 것이다. 따라서 <InlineMath>{`1-\\dfrac{1}{(x + 1) ^ 2}`}</InlineMath> 형태가 아닌{' '}
                <InlineMath>{`\\dfrac{1}{x ^ 2}-\\dfrac{1}{(x + 1) ^ 2}`}</InlineMath>을 사용할 것이다.
            </p>

            <NextImage
                src={pic125}
                alt="아래쪽 그래프들이 기준이 된다"
                caption="아래쪽 그래프들이 기준이 된다"
                width={600}
                center
            />

            <Latex caption="k 값이 가장 높은 점으로 옮긴 방정식">{`R_{l}(x) = r(\\dfrac{1}{(x + k_{h}) ^ 2}-\\dfrac{1}{(x + k_{h} + 1) ^ 2})`}</Latex>
            <Latex caption="k 값이 가장 낮은 점으로 옮긴 방정식">{`R_{h}(x) = r(\\dfrac{1}{(x + k_{l}) ^ 2}-\\dfrac{1}{(x + k_{l} + 1) ^ 2})`}</Latex>
            <Latex>{`R_{h}(x) - R_{l}(x) : 100 = p_{x} - p_{x-1} - R_{l}(x) : v`}</Latex>
            <Latex>{`\\to v = \\dfrac{100(p_{x} - p_{x-1} - R_{l}(x))}{R_{h}(x) - R_{l}(x)}`}</Latex>

            <p>패턴이 나타나는지 보자.</p>

            <h2>
                <Link href="/ether/data/orbital/1/1" target="_blank" rel="noreferrer">
                    수소
                </Link>
            </h2>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic122}
                        alt="수소 오비탈 값의 Between"
                        caption={
                            <>
                                수소 오비탈 <sup>2</sup>S<sub>1/2</sub> 값의 Between
                            </>
                        }
                        width={600}
                    />
                </Column>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic123}
                        alt="수소 에테르 값의 Between"
                        caption={
                            <>
                                수소 에테르 <sup>2</sup>S<sub>1/2</sub> 값의 Between
                            </>
                        }
                        width={600}
                    />
                </Column>
            </Row>

            <p>
                수소는 양쪽 모두에서 패턴이 나타난다. 수소는 뤼드베리 방정식으로 설명이 될 만큼 오차가 매우 작은
                원소이기 때문이다.
            </p>

            <h2>
                <Link href="/ether/data/orbital/2/1" target="_blank" rel="noreferrer">
                    헬륨
                </Link>
            </h2>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic114}
                        alt="헬륨 오비탈 값의 Between"
                        caption={
                            <>
                                헬륨 오비탈 <sup>1</sup>S<sub>0</sub> 값의 Between
                            </>
                        }
                        width={600}
                    />
                </Column>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic115}
                        alt="헬륨 에테르 값의 Between"
                        caption={
                            <>
                                헬륨 에테르 <sup>1</sup>S<sub>0</sub> 값의 Between
                            </>
                        }
                        width={600}
                    />
                </Column>
            </Row>

            <p>
                오비탈의 변화는 살짝 떨어지는 것과 살짝 올라가는 것이 있지만, 오차라고 볼 수 있다. 에테르 변화는 역시
                뚜렷하게 나타난다. 조금더 변화량을 잘 볼 수 있는 높은 번호의 원소를 보자.
            </p>

            <h2>높은 번호의 원소들</h2>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic116}
                        alt="베릴륨 오비탈 값의 Between"
                        caption={
                            <>
                                베릴륨 오비탈 <sup>1</sup>S<sub>0</sub> 값의 Between
                            </>
                        }
                        width={600}
                    />
                </Column>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic117}
                        alt="베릴륨 에테르 값의 Between"
                        caption={
                            <>
                                베릴륨 에테르 <sup>1</sup>S<sub>0</sub> 값의 Between
                            </>
                        }
                        width={600}
                    />
                </Column>
            </Row>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic118}
                        alt="소디움 오비탈 값의 Between"
                        caption={
                            <>
                                소디움 오비탈 <sup>2</sup>S<sub>1/2</sub> 값의 Between
                            </>
                        }
                        width={600}
                    />
                </Column>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic119}
                        alt="소디움 에테르 값의 Between"
                        caption={
                            <>
                                소디움 에테르 <sup>2</sup>S<sub>1/2</sub> 값의 Between
                            </>
                        }
                        width={600}
                    />
                </Column>
            </Row>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic120}
                        alt="세슘 오비탈 값의 Between"
                        caption={
                            <>
                                세슘 오비탈 <sup>2</sup>S<sub>1/2</sub> 값의 Between
                            </>
                        }
                        width={600}
                    />
                </Column>
                <Column medium={6} small={12}>
                    <NextImage
                        src={pic121}
                        alt="세슘 에테르 값의 Between"
                        caption={
                            <>
                                세슘 에테르 <sup>2</sup>S<sub>1/2</sub> 값의 Between
                            </>
                        }
                        width={600}
                    />
                </Column>
            </Row>

            <p>
                공통적으로 p 오비탈이 좀 튀는 녀석으로 보이고, 여전히 에테르 분류법에서는 뚜렷한 패턴을 볼 수 있다.
                이것으로 방정식을 만든다면 p를 예외로 주어야 할 것이다. 세슘과 같은 더 높은 원소로 가면 d 까지도 예외가
                된다.
            </p>

            <p>
                Transform과 Between 모두에서 공통적으로 볼 수 있는 경향이 존재한다. 뤼드베리 방정식을 이동하는 것으로 꽤
                오차가 적은 예측값을 얻을 수 있다. 그 적은 오차에서도 기존의 오비탈 분류법 보다는 원형을 우선 배치하는
                에테르 분류법이 더 확실한 패턴을 볼 수 있다는 것이다. 완전한 증거라고 주장하는 것은 아니지만 혹시 맞을
                수도 있지 않을까 하는 가능성을 제시하는 것으로 증명을 마치도록 하겠다.
            </p>

            <PrevNext
                prev={{
                    title: '가설의 검증(3): 방출 에너지 분석',
                    link: '/ether/kor/document/analysis',
                }}
                next={{
                    title: '결론',
                    link: '/ether/kor/document/conclusion',
                }}
            ></PrevNext>
        </div>
    )
}
