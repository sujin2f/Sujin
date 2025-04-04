import { InlineMath } from 'react-katex'
import Link from 'next/link'
/* Components */
import { Image } from '@common/components/containers/image'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Latex } from '@app/(single)/_components/Latex'
import { PrevNext } from '@app/(single)/_components/PrevNext'
import { ScrollToTop } from '@app/_components/ScrollToTop'
/* Types */
import type { PostType } from '@app/_lib/data/mysql/types'
/* Assets */
import pic58 from '@app/_lib/images/ether/pic58.png'
import pic114 from '@app/_lib/images/ether/pic114.png'
import pic115 from '@app/_lib/images/ether/pic115.png'
import pic116 from '@app/_lib/images/ether/pic116.png'
import pic117 from '@app/_lib/images/ether/pic117.png'
import pic118 from '@app/_lib/images/ether/pic118.png'
import pic119 from '@app/_lib/images/ether/pic119.png'
import pic120 from '@app/_lib/images/ether/pic120.png'
import pic121 from '@app/_lib/images/ether/pic121.png'
import pic122 from '@app/_lib/images/ether/pic122.png'
import pic123 from '@app/_lib/images/ether/pic123.png'
import pic125 from '@app/_lib/images/ether/pic125.png'
import 'katex/dist/katex.min.css'

export default function Between() {
    return (
        <div className="ether" style={{ counterReset: 'fig 40 tbl 7 equ 9' }}>
            <ScrollToTop />
            <p>
                It raises a question: Is it really appropriate to shift the
                changes in circular ether towards the s orbital side and the
                rest towards the p orbital side for comparison? Could combining
                changes involving linear ether reveal their own patterns?
                Perhaps a more objective comparison is needed. Let&apos;s
                revisit the arrangement of values in helium.
            </p>

            <Image
                src={pic58}
                alt="s and p Orbital of Helium"
                caption="s and p Orbital of Helium"
                width={600}
                center
            />

            <p>
                In the previous section, we shifted the graph of s orbitals,
                which only have circular ether, to one reference point and moved
                the rest, with linear ether, towards the p orbital side. The new
                criterion to be proposed is to create coordinates from these two
                shifted graphs. By considering the graph shifted with{' '}
                <code>[O]</code> as 0 and the graph shifted with{' '}
                <code>[-]</code> as 100, the positions of the points will be
                marked. It is about placing the top purple line as 100 and the
                bottom red dot as 0 in the above diagram, and observing how the
                points move between them. By using this method, all points can
                be aligned based on a single criterion. Let&apos;s call this the
                &ldquo;Between,&rdquo; and let the previous one be called the
                &ldquo;Transform.&rdquo;
            </p>

            <p>
                However, the above diagram cannot be used as is. What we want to
                understand is not the position of the points, but rather how
                much they have changed from their previous values. Therefore, we
                will use
                <InlineMath>{`\\dfrac{1}{x ^ 2}-\\dfrac{1}{(x + 1) ^ 2}`}</InlineMath>{' '}
                instead of{' '}
                <InlineMath>{`1-\\dfrac{1}{(x + 1) ^ 2}`}</InlineMath>.
            </p>

            <Image
                src={pic125}
                alt="The bottom graphs serve as the reference"
                caption="The bottom graphs serve as the reference"
                width={600}
                center
            />

            <Latex caption="R(x) with highest k">{`R_{l}(x) = r(\\dfrac{1}{(x + k_{h}) ^ 2}-\\dfrac{1}{(x + k_{h} + 1) ^ 2})`}</Latex>
            <Latex caption="R(x) with lowest k">{`R_{h}(x) = r(\\dfrac{1}{(x + k_{l}) ^ 2}-\\dfrac{1}{(x + k_{l} + 1) ^ 2})`}</Latex>
            <Latex>{`R_{h}(x) - R_{l}(x) : 100 = p_{x} - p_{x-1} - R_{l}(x) : v`}</Latex>
            <Latex>{`\\to v = \\dfrac{100(p_{x} - p_{x-1} - R_{l}(x))}{R_{h}(x) - R_{l}(x)}`}</Latex>

            <p>Let&apos;s see if a pattern emerges</p>

            <h2>
                <Link
                    href="/ether/data/orbital/1/1"
                    target="_blank"
                    rel="noreferrer"
                >
                    Hydrogen
                </Link>
            </h2>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <Image
                        src={pic122}
                        alt="Betweens in the Hydrogen Orbital Values"
                        caption={
                            <>
                                Betweens in the Hydrogen Orbital Values{' '}
                                <sup>2</sup>S<sub>1/2</sub>
                            </>
                        }
                    />
                </Column>
                <Column medium={6} small={12}>
                    <Image
                        src={pic123}
                        alt="Betweens in the Hydrogen Ether Values"
                        caption={
                            <>
                                Betweens in the Hydrogen Ether Values{' '}
                                <sup>2</sup>S<sub>1/2</sub>
                            </>
                        }
                    />
                </Column>
            </Row>

            <p>
                Hydrogen exhibits patterns on both sides. This is because
                hydrogen is an element with very small errors that can be
                explained by the Rydberg formula.
            </p>

            <h2>
                <Link
                    href="/ether/data/orbital/2/1"
                    target="_blank"
                    rel="noreferrer"
                >
                    Helium
                </Link>
            </h2>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <Image
                        src={pic114}
                        alt="Betweens in the Helium Orbital Values"
                        caption={
                            <>
                                Betweens in the Helium Orbital Values{' '}
                                <sup>1</sup>S<sub>0</sub>
                            </>
                        }
                    />
                </Column>
                <Column medium={6} small={12}>
                    <Image
                        src={pic115}
                        alt="Betweens in the Helium Ether Values"
                        caption={
                            <>
                                Betweens in the Helium Ether Values <sup>1</sup>
                                S<sub>0</sub>
                            </>
                        }
                    />
                </Column>
            </Row>

            <p>
                The changes in the orbitals show a slight decrease and a slight
                increase, but it can be considered as noise. The variation in
                ether, on the other hand, is clearly evident. Let&apos;s examine
                elements with higher numbers to better observe the extent of the
                changes.
            </p>

            <h2>Higher Atomic Numbers</h2>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <Image
                        src={pic116}
                        alt="Betweens in the Beryllium Orbital Values"
                        caption={
                            <>
                                Betweens in the Beryllium Orbital Values{' '}
                                <sup>1</sup>S<sub>0</sub>
                            </>
                        }
                    />
                </Column>
                <Column medium={6} small={12}>
                    <Image
                        src={pic117}
                        alt="Betweens in the Beryllium Ether Values"
                        caption={
                            <>
                                Betweens in the Beryllium Ether Values{' '}
                                <sup>1</sup>S<sub>0</sub>
                            </>
                        }
                    />
                </Column>
            </Row>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <Image
                        src={pic118}
                        alt="Betweens in the Sodium Orbital Values"
                        caption={
                            <>
                                Betweens in the Sodium Orbital Values{' '}
                                <sup>2</sup>S<sub>1/2</sub>
                            </>
                        }
                    />
                </Column>
                <Column medium={6} small={12}>
                    <Image
                        src={pic119}
                        alt="Betweens in the Sodium Ether Values"
                        caption={
                            <>
                                Betweens in the Sodium Ether Values <sup>2</sup>
                                S<sub>1/2</sub>
                            </>
                        }
                    />
                </Column>
            </Row>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <Image
                        src={pic120}
                        alt="Betweens in the Cesium Orbital Values"
                        caption={
                            <>
                                Betweens in the Cesium Orbital Values{' '}
                                <sup>2</sup>S<sub>1/2</sub>
                            </>
                        }
                    />
                </Column>
                <Column medium={6} small={12}>
                    <Image
                        src={pic121}
                        alt="Betweens in the Cesium Ether Values"
                        caption={
                            <>
                                Betweens in the Cesium Ether Values <sup>2</sup>
                                S<sub>1/2</sub>
                            </>
                        }
                    />
                </Column>
            </Row>

            <p>
                Commonly, it seems that the p orbital exhibits some
                irregularities, and there is still a clear pattern in the ether
                classification. If we were to create an equation based on this,
                we might need to treat p as an exception. As we go to higher
                elements like cesium, even d orbitals become exceptions.
            </p>

            <p>
                Both in Transform and Between, there is a common trend. Shifting
                the Rydberg formula seems to yield predictions with relatively
                low errors. Even in these small errors, the ether classification
                method shows a more distinct pattern than the traditional
                orbital classification method. While this is not a conclusive
                proof, it suggests the possibility that the ether classification
                method might provide clearer patterns than the traditional
                method. This concludes the demonstration.
            </p>

            <PrevNext
                posts={[
                    {
                        title: 'Proof(3): Emission Energy Analysis',
                        link: '/ether/document/analysis',
                    } as PostType,
                    {
                        title: 'Conclusion',
                        link: '/ether/document/conclusion',
                    } as PostType,
                ]}
            ></PrevNext>
        </div>
    )
}
