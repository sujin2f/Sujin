import { InlineMath } from 'react-katex'
import Link from 'next/link'
/* Components */
import { Image } from '@common/components/containers/image'
import { Table } from '@common/components/containers/Table'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Latex } from '@app/(single)/_components/Latex'
import { PrevNext } from '@app/(single)/_components/PrevNext'
import { ScrollToTop } from '@app/_components/ScrollToTop'
/* Types */
import type { PostType } from '@app/_lib/data/mysql/types'
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
        <div className="ether" style={{ counterReset: 'fig 19 tbl 6 equ 7' }}>
            <ScrollToTop />
            <p>
                The formula is ready. Let&apos;s proceed to the comparisons. I
                will bring back the last graph from the previous section with
                some enhancements.
            </p>

            <Image
                src={pic96}
                alt="Changes in the Helium Orbital Values"
                caption="Changes in the Helium Orbital Values"
                width={600}
                center
            />

            <p>
                The 0 position represents the point where the first ether
                appears in the ground state. Since the reference for the
                horizontal shift is the first ether, setting the difference in
                values to 0 is acceptable. Additionally, a violet 1 position for
                the d orbital has been added. Blue represents the s orbital,
                green represents the p orbital. The blue values of the s orbital
                are all changes corresponding to the increase in circular ether.
                The first value in green, representing the p orbital, is the
                change from <code>[X]</code> to <code>[-]</code>, and the rest
                are changes corresponding to the increase in circular ether.
                Finally, the violet values for the d orbital also show an
                increase in linear ether for the first value, and the rest
                indicate an increase in circular ether.
            </p>
            <p>
                The increase in circular ether in the s and p orbitals seems to
                exhibit a pattern of initially peaking, then dropping, and
                rising again before converging to a focal point. However, the
                pattern for d is different. There could be some error. Is it not
                converging well to a focal point? It&apos;s too early to give up
                hope.
            </p>

            <Image
                src={pic97}
                alt="Changes in the Helium Orbital Values + Linear Ether"
                caption="Changes in the Helium Orbital Values + Linear Ether"
                width={600}
                center
            />

            <p>
                The added red line represents the change in the number of linear
                ether: <code>[X]</code>, <code>[-]</code>, <code>[--]</code>,{' '}
                <code>[---]</code>. Clearly, the other values correspond to
                changes in the number of circular ether, but the d orbital
                aligns with the changes in linear ether. If the accumulation of
                circular and linear ether determines the emitted energy,
                circular should follow a circular pattern, and linear should
                follow a linear pattern. That&apos;s how addition works. It
                failed. The hypothesis is broken. Farewell, everyone.
            </p>

            <h2>Which comes first, the circle or the line?</h2>

            <p>
                Let&apos;s raise a brief question here. Between{' '}
                <code>[-O]</code> and <code>[O-]</code>, which one seems correct
                to you? Some might wonder what difference it makes, and others
                might think as I do that the first one is correct. Those who
                think the first one is correct may base their orbital
                classification on the number of linear ether. For example, as
                the p orbital changes in <code>[-]</code>, <code>[-O]</code>,{' '}
                <code>[-OO]</code>, they habitually place the linear part at the
                beginning. However, if you consider it as <code>[O-]</code>, the
                meaning completely changes.
            </p>

            <p>
                The ether in the first position is very large, while the one in
                the second position is relatively small. The values for circular
                and linear ether are different. When these three are combined,
                the values for <code>[-O]</code> and <code>[O-]</code> must be
                different if it&apos;s an addition. If
                <code>[O]</code> is 10, <code>[-]</code> is 11, and{' '}
                <code>[O-]</code> is 12, for instance. If linear comes first,
                then in <code>[-O]</code>, circular should be 1, and if circular
                comes first, in the second position of <code>[O-]</code>, linear
                should be 2. So, it can be said that what accumulates first is
                very important.
            </p>

            <p>
                <code>[X]</code> =&gt; <code>[O]</code> =&gt; <code>[OO]</code>{' '}
                =&gt; <code>[OOO]</code> =&gt; <code>[OOOO]</code> represents
                the s orbital and circular ether. <code>[X]</code> =&gt;{' '}
                <code>[-]</code> =&gt; <code>[--]</code> =&gt;{' '}
                <code>[---]</code> =&gt; <code>[----]</code> represents the
                linear ether, changing as <code>1s</code> =&gt; <code>2p</code>{' '}
                =&gt; <code>3d</code> =&gt; <code>4f</code>. <code>[O]</code>{' '}
                =&gt; <code>[O-]</code> =&gt; <code>[O--]</code> =&gt;{' '}
                <code>[O---]</code> represents the stacking of linear ether on
                one circular ether, changing as <code>2s</code> =&gt;{' '}
                <code>3p</code> =&gt; <code>4d</code> =&gt; <code>5f</code>.
            </p>

            <p>Let&apos;s rearrange the values.</p>

            <Image
                src={pic98}
                alt="Circle comes first!"
                caption="Circle comes first!"
                width={600}
                center
            />

            <p>
                The blue line remains the s orbital, showing the pattern of
                increasing circular ether, just like before. The red line also
                represents the change in the number of linear ether, as in the
                previous plot. The green line represents the changes in values
                where one circular ether is fixed and linear ether increases. In
                other words, the blue line shows changes in circular ether,
                while the others show changes in linear ether. Can you see it,
                humans? Behold! How beautiful is this pattern! Placing circular
                first seems to exhibit a better pattern. The orbital
                classification based on the number of linear ether, like s, p,
                d, may be incorrect.
            </p>

            <p>
                A hint was caught in the specific case of helium. But can this
                be applied to all atoms? Let&apos;s make it. After all, I am a
                computer programmer.
            </p>

            <p>
                So, I{' '}
                <Link
                    href="/ether/data/orbital/2/1"
                    target="_blank"
                    rel="noreferrer"
                >
                    created it
                </Link>
                .
            </p>

            <p>
                I will distinguish the classification that prioritizes linear
                (as in traditional orbital classification) from the
                classification that prioritizes circular ether and denote it as
                &ldquo;Ether Classification.&rdquo;
            </p>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <Image
                        src={pic100}
                        alt="Changes in the Helium Orbital Values"
                        caption="Changes in the Helium Orbital Values"
                    />
                </Column>
                <Column medium={6} small={12}>
                    <Image
                        src={pic99}
                        alt="Changes in the Helium Ether Values"
                        caption="Changes in the Helium Ether Values"
                    />
                </Column>
            </Row>

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
                        src={pic102}
                        alt="Changes in the Hydrogen Orbital Values"
                        caption="Changes in the Hydrogen Orbital Values"
                    />
                </Column>
                <Column medium={6} small={12}>
                    <Image
                        src={pic101}
                        alt="Changes in the Hydrogen Ether Values"
                        caption="Changes in the Hydrogen Ether Values"
                    />
                </Column>
            </Row>

            <p>
                Unfortunately, hydrogen lacks distinctiveness in this context.
                Firstly, hydrogen already has a very low error with the existing
                Rydberg formula. The second reason is that the r value I used
                (the height of the graph in hydrogen) is derived from the
                ionization energy values obtained{' '}
                <Link
                    href="https://github.com/Bowserinator/Periodic-Table-JSON"
                    target="_blank"
                    rel="noreferrer"
                >
                    here
                </Link>
                , which may have a slight margin of error. This is true for all
                atoms, but hydrogen has such a small error that even a change of
                0.0001 significantly alters the graph.
            </p>

            <p>
                However, we cannot simply overlook this. Hydrogen&apos;s r value
                is a crucial factor used as the ratio of the graph in many
                atoms. Let&apos;s make a correction. The obtained value is{' '}
                <code>1312 J</code>, but after some trial and error, I found it
                to be <code>13.5984355 eV</code>. I applied this value and
                redraw the graph.
            </p>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <Image
                        src={pic103}
                        alt="Changes in the Hydrogen Orbital Values"
                        caption={
                            <>
                                Changes in the Hydrogen Orbital Values{' '}
                                <sup>2</sup>S<sub>1/2</sub>
                            </>
                        }
                    />
                </Column>
                <Column medium={6} small={12}>
                    <Image
                        src={pic104}
                        alt="Changes in the Hydrogen Ether Values"
                        caption={
                            <>
                                Changes in the Hydrogen Ether Values{' '}
                                <sup>2</sup>S<sub>1/2</sub>
                            </>
                        }
                    />
                </Column>
            </Row>

            <p>
                It still lacks distinctiveness. The Rydberg formula resembles a
                logarithmic function that decreases in variation as you go
                further back. Naturally, as the graph converges backward, it
                becomes challenging to observe changes. To slightly widen that
                gap, I&apos;ll make a very small modification to the equation.
            </p>

            <Latex
                caption={
                    <>
                        The difference D(x) when energy is emitted from energy v
                        <sub>2</sub> to v<sub>1</sub>
                        in the modified Rydberg formula.
                    </>
                }
            >{`D(x) = v_2 - v_1 - (R(x+1+k_{2}) - R(x+k_{1}))`}</Latex>
            <Latex caption="The result D(x), where weights are applied to make it easier to see as you go backward">{`D(x) = \\dfrac{v_2 - v_1 - (R(x+1+k_{2}) - R(x+k_{1}))}{R(x+1+k_{2}) - R(x+k_{1})} `}</Latex>

            <Image
                src={pic105}
                alt="Changes in the Hydrogen Ether Values with D(x)"
                caption={
                    <>
                        Changes in the Hydrogen Ether Values <sup>2</sup>S
                        <sub>1/2</sub> with D(x)
                    </>
                }
                width={600}
                center
            />

            <p>
                Now that it&apos;s a bit easier to see, let&apos;s adopt this
                formula consistently.
            </p>

            <h2>
                <Link
                    href="/ether/data/ether/2/1"
                    target="_blank"
                    rel="noreferrer"
                >
                    Helium
                </Link>
            </h2>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <Image
                        src={pic112}
                        alt="Changes in the Helium Orbital Values"
                        caption={
                            <>
                                Changes in the Helium Orbital Values{' '}
                                <sup>1</sup>S<sub>0</sub>
                            </>
                        }
                    />
                </Column>
                <Column medium={6} small={12}>
                    <Image
                        src={pic99}
                        alt="Changes in the Helium Ether Values"
                        caption={
                            <>
                                Changes in the Helium Ether Values <sup>1</sup>S
                                <sub>0</sub>
                            </>
                        }
                    />
                </Column>
            </Row>

            <p>
                Helium&apos;s graph, as shown earlier in this conversation, is
                identical to the one using the weighted function D(x), with the
                added emphasis on regularities. Still, there are no clear
                patterns in the orbitals, while patterns can be observed in the
                ethers.
            </p>

            <h2>
                <Link
                    href="/ether/data/ether/3/1"
                    target="_blank"
                    rel="noreferrer"
                >
                    Lithium
                </Link>
            </h2>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <Image
                        src={pic106}
                        alt="Changes in the Lithium Orbital Values"
                        caption={
                            <>
                                Changes in the Lithium Orbital Values{' '}
                                <sup>2</sup>S<sub>1/2</sub>
                            </>
                        }
                    />
                </Column>
                <Column medium={6} small={12}>
                    <Image
                        src={pic107}
                        alt="Changes in the Lithium Ether Values"
                        caption={
                            <>
                                Changes in the Lithium Ether Values <sup>2</sup>
                                S<sub>1/2</sub>
                            </>
                        }
                    />
                </Column>
            </Row>

            <p>
                The change in lithium orbitals may not have been as noticeable
                messed up, but the weighting with D(x) emphasizes the
                differences in the higher positions. Even so, a similar pattern
                can be observed in lithium. However, as a non-expert, I find it
                challenging to discern which configurations might be grouped
                together as the atomic number increases. Unfortunately, this
                limits my ability to create a more definitive resource on the
                topic.
            </p>

            <h2>Analysis of the Ground-State of Atoms beyond Lithium</h2>

            <p>
                The curve traced by hydrogen fits well into the Rydberg formula.
                Helium exhibits an upward trend in the graph, with values rising
                along with the peak. However, starting from lithium, the trend
                shifts downward, and thereafter, it becomes erratic. What could
                be the reason for this? Let&apos;s first examine the values of
                circular ether for hydrogen-like atoms and helium-like atoms.
                While eV is suitable for calculating energy, it lacks
                intuitiveness, so the values are expressed in Rydberg units
            </p>

            <Table scroll caption="Values of the One Circular Ether">
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
                Surprisingly, the approximate values fall quite neatly:{' '}
                <code>0.75</code>, <code>1.5</code>, <code>3</code>,{' '}
                <code>4.5</code>,<code>6.75</code>, <code>9</code>,{' '}
                <code>12</code>, <code>18.75</code>. They are all multiples of
                0.75. Notably, 0.75 is also the value when x is 1 in the Rydberg
                formula. So, how many times is each of these values a multiple
                of 0.75?
            </p>

            <Image
                src={pic29}
                alt="How Many Times of 0.75?"
                caption={
                    <>
                        <strong>How Many Times of 0.75?</strong>: Red represents
                        the measured values, while blue represents the predicted
                        values
                    </>
                }
                width={600}
                center
            />

            <p>
                Let&apos;s focus on the red values first. The values along the
                first diagonal are all 1, 4, 9, 16, matching Z squared,
                indicating the Rydberg formula expressing the atomic
                number&apos;s increase as Z squared. Looking at the diagonal for
                horizontal changes, it follows a consistent pattern of +1, +2,
                +3, +4. This could be understood as the shift in the vertical
                direction, which corresponds to the s value. The vertical
                changes also follow a consistent pattern of +2, +3, +4.
                Predicting changes in values as integer multiples of 0.75 seems
                plausible. This suggests that Li I could be 3, and Be I could be
                4. Assuming this, looking at the vertical changes, we can
                observe that lithium becomes{' '}
                <InlineMath>{`\\begin{bmatrix}+3\\\\+3\\end{bmatrix}`}</InlineMath>
                , and beryllium becomes{' '}
                <InlineMath>{`\\begin{bmatrix}+4\\\\+4\\\\+4\\end{bmatrix}`}</InlineMath>
                . Another possibility is assuming the horizontal axis changes as{' '}
                <InlineMath>{`\\begin{bmatrix}+1 & +2 & +3 & +4 & ...\\end{bmatrix}`}</InlineMath>
                . In this case, the vertical changes would increase by 1, like{' '}
                <InlineMath>{`\\begin{bmatrix}+2\\\\+3\\end{bmatrix}`}</InlineMath>
                . Between the two possibilities, the first one seems more
                convincing. This is because the impact of <code>[X]</code> on
                the vertical shift becomes constant at 0.75. Hydrogen has no{' '}
                <code>[X]</code>, making its peak 0.75. For helium, 0.75 plus
                the impact of one <code>[X]</code> results in 1.5. For lithium,
                it becomes 2.25 with the impact of two <code>[X]</code>.
                Let&apos;s follow Occam&apos;s razor, which suggests that the
                simpler explanation is more likely to be true. If illustrated,
                it would look like the following.
            </p>

            <Image
                src={pic42}
                alt="Prediction of Vertical Shifts"
                caption="Prediction of Vertical Shifts"
                width={600}
                center
            />

            <Image
                src={pic65}
                alt="Result of Shifting Lithium's points by the Hypothesis"
                caption={
                    <>
                        <strong>
                            Result of Shifting Lithium&apos;s points by the
                            Hypothesis
                        </strong>{' '}
                        Isn&apos;t this beautiful?
                    </>
                }
                width={600}
                center
            />

            <p>
                The ground state of lithium is <code>[X]2[O]</code>. The last{' '}
                <code>[O]</code> cannot be <code>[X]</code> due to the Pauli
                exclusion principle in the filling of multi-electron atoms.
                Therefore, the ground state of lithium can be considered as if
                the x-axis itself has shifted upward to the ground state. This
                demonstrates that the Rydberg formula can still be applicable
                even in this case.
            </p>

            <h2>
                <Link
                    href="/ether/data/ether/4/1"
                    target="_blank"
                    rel="noreferrer"
                >
                    Beryllium
                </Link>
            </h2>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <Image
                        src={pic108}
                        alt="Changes in the Beryllium Orbital Values"
                        caption={
                            <>
                                Changes in the Beryllium Orbital Values{' '}
                                <sup>1</sup>S<sub>0</sub>
                            </>
                        }
                    />
                </Column>
                <Column medium={6} small={12}>
                    <Image
                        src={pic109}
                        alt="Changes in the Beryllium Ether Values"
                        caption={
                            <>
                                Changes in the Beryllium Ether Values{' '}
                                <sup>1</sup>S<sub>0</sub>
                            </>
                        }
                    />
                </Column>
            </Row>

            <p>
                Beryllium is also beautiful. Let&apos;s tell a slightly
                different story than lithium. Can we also shift the graph for
                beryllium &lsquo;as it originally was&rsquo; like lithium? The
                answer is &lsquo;possible, but challenging.&rsquo;
            </p>

            <p>
                The ground state of beryllium is <code>[X]2[O]2</code>. Two
                circular orbitals are involved. Let&apos;s assume that the
                vertical shift due to <code>[X]</code> is the same as lithium.
                However, what impact do the two <code>[O]</code> have? To infer
                this, we can look at the case where there are two ethers in
                helium and lithium.
            </p>

            <p>
                For helium, the eV value of <code>[X][O]</code> is
                20.6157751334, and the peak is at 24.58732518. However,{' '}
                <code>[O][-]</code> is as high as 58.311. The same pattern
                exists for lithium. The value for the next state after the
                ground state, <code>[X]2[OO]</code>, is 3.373129, but
                <code>[X][O][-]</code> is 57.469. When two ethers are present,
                the values skyrocket. Therefore, understanding the vertical
                shift caused by two
                <code>[X]</code> and the vertical shift caused by two{' '}
                <code>[O]</code> is necessary to determine the ground state of
                beryllium.
            </p>

            <Row fullWidth>
                <Column small={4}></Column>
                <Column small={3}>
                    <Image src={pic86} alt="Energy Distribution of Lithium" />
                </Column>
            </Row>

            <p>
                <strong>Energy Distribution of Lithium</strong> To decipher
                beryllium, one must understand the rules of the constellations
                above
            </p>

            <p>
                States beyond beryllium would require further exploration to
                unravel. However, what I want to emphasize here is the
                prediction that it will also be based on the Rydberg formula.
                Why? Because the graph of beryllium is also beautiful.
            </p>

            <h2>
                <Link
                    href="/ether/data/ether/11/1"
                    target="_blank"
                    rel="noreferrer"
                >
                    Sodium
                </Link>
            </h2>

            <p>
                Finally, let&apos;s look at sodium. As mentioned earlier, it is
                very challenging for non-experts to accurately classify values
                up to neon due to their limitations. However, looking at the
                approximate shape of{' '}
                <Link
                    href="/ether/data/ether/8/1"
                    target="_blank"
                    rel="noreferrer"
                >
                    oxygen
                </Link>
                , I expect that everything else will also show a pattern as long
                as the values are correctly arranged.
            </p>

            <p>
                Interestingly, after beryllium, the atom where the pattern
                becomes clear is sodium. It is a friend in the same group as
                hydrogen on the{' '}
                <Link
                    href="https://www.google.com/search?q=periodic+table"
                    target="_blank"
                    rel="noreferrer"
                >
                    periodic table
                </Link>
                . It is a friend with a similar structure where orbitals are
                initially arranged in a circular shape in the shell.
            </p>

            <Row fullWidth>
                <Column medium={6} small={12}>
                    <Image
                        src={pic110}
                        alt="Changes in the Sodium Orbital Values"
                        caption={
                            <>
                                Changes in the Sodium Orbital Values{' '}
                                <sup>2</sup>S<sub>1/2</sub>
                            </>
                        }
                    />
                </Column>
                <Column medium={6} small={12}>
                    <Image
                        src={pic111}
                        alt="Changes in the Sodium Ether Values"
                        caption={
                            <>
                                Changes in the Sodium Ether Values <sup>2</sup>S
                                <sub>1/2</sub>
                            </>
                        }
                    />
                </Column>
            </Row>

            <PrevNext
                posts={[
                    {
                        title: 'Proof(2): Reinterpretation of Rydberg Formula',
                        link: '/ether/document/rydberg-formula',
                    } as PostType,
                    {
                        title: 'Proof(4): Between Comparison',
                        link: '/ether/document/between',
                    } as PostType,
                ]}
            ></PrevNext>
        </div>
    )
}
