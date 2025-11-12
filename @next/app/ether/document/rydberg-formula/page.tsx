import Link from 'next/link'
import { InlineMath } from 'react-katex'
/* Components */
import { NextImage } from '@sujin/common/components/containers/NextImage'
import Table from '@sujin/common/components/containers/Table'
import { Latex } from '@app/(single)/_components/Latex'
import { PrevNext } from '@app/(single)/_components/PrevNext'
import Wrapper from '@app/ether/wrapper'
/* Assets */
import pic9 from '@app/_lib/images/ether/pic9.png'
import pic10 from '@app/_lib/images/ether/pic10.png'
import pic55 from '@app/_lib/images/ether/pic55.png'
import pic56 from '@app/_lib/images/ether/pic56.png'
import pic57 from '@app/_lib/images/ether/pic57.png'
import pic58 from '@app/_lib/images/ether/pic58.png'
import pic59 from '@app/_lib/images/ether/pic59.png'
import pic92 from '@app/_lib/images/ether/pic92.jpeg'
import pic93 from '@app/_lib/images/ether/pic93.jpeg'
import pic94 from '@app/_lib/images/ether/pic94.png'
import pic95 from '@app/_lib/images/ether/pic95.png'
import pic113 from '@app/_lib/images/ether/pic113.png'
import 'katex/dist/katex.min.css'

export default function RydbergFormula() {
    return (
        <Wrapper style={{ counterReset: 'fig 7 tbl 6 equ 2' }}>
            <p>
                So far, the hypothesis has been tested based on Bohr&apos;s
                atomic model. However, Bohr&apos;s atomic model is no longer
                valid. It does not apply to multi-electron atoms, and in
                reality, electrons do not orbit in circular paths. What quantum
                physics has revealed is that electrons within an atom manifest
                as shapes (probability) called orbitals by absorbing energy.
                Within the orbital, the electron exists probabilistically.
            </p>

            <NextImage
                src={pic9}
                alt="Electron Orbital"
                caption={
                    <>
                        <strong>Electron Orbital</strong>{' '}
                        <Link
                            href="https://en.wikipedia.org/wiki/Atomic_orbital"
                            target="_blank"
                            rel="noreferrer"
                        >
                            credit: Wikipedia
                        </Link>
                    </>
                }
                center
                width={600}
            />

            <h2>Hypothesis: The nodes of orbitals are photon-Ether</h2>

            <p>
                In the diagram, the black regions are referred to as nodes. The
                shape of the orbitals is determined by the pattern and number of
                these nodes. The orbital&apos;s shape is influenced by the
                principal quantum number <code>n</code>, azimuthal quantum
                number <code>l</code>, and magnetic quantum number{' '}
                <code>
                    m<sub>l</sub>
                </code>
                , as introduced in Bohr&apos;s atomic model. An increase in{' '}
                <code>n</code> results in an increase in the number of circular
                patterns, similar to Bohr&apos;s atomic model. An increase in{' '}
                <code>l</code> leads to the disappearance of one circular
                pattern, giving rise to linear nodes. The magnetic quantum
                number determines the orientation.
            </p>

            <p>
                An orbital with circular nodes is referred to as an s orbital.
                If there are no nodes, it is labeled as <code>1s</code>; with
                one circular node, it becomes <code>2s</code>. An orbital with
                one linear node is designated as a p orbital. With one linear
                node is <code>2s</code>, and one linear and one circular node is{' '}
                <code>3p</code>, and so forth. Following this pattern, orbitals
                with specific numbers of linear nodes are assigned letters such
                as <code>d</code>, <code>f</code>, <code>g</code>, etc. Now,
                let&apos;s reinterpret the orbitals assuming the nodes are
                photon-Ether.
            </p>

            <NextImage
                src={pic10}
                alt="Viewing Orbitals from the Perspective of Ether"
                caption={
                    <>
                        <strong>
                            Viewing Orbitals from the Perspective of Ether
                        </strong>{' '}
                        See the circular and linear ethers
                    </>
                }
                center
                width={600}
            />

            <p>
                An increase in <code>n</code> signifies an increase in the
                number of Ether entities, and an increase in <code>l</code>{' '}
                transforms the circular Ether into a linear form. An s orbital
                contains only circular Ether, while a p orbital can be
                interpreted as having one linear Ether and one circular Ether.
                The <code>1s</code> orbital corresponds to a state without
                Ether, and the <code>3p</code> orbital represents a state with
                one circular and one linear Ether
            </p>

            <p>
                This is commonly understood as a transformation in the shape of
                the electron. However, from the Ether perspective, the black
                nodes represent Ether, and the Ether of the electron maintains a
                spherical shape, with space separated by photon-Ether. It can be
                understood as if the Ether of the electron is split, similar to
                the double-slit experiment. Therefore, the electron-Sparkle
                probabilistically exists in the separated space, shaped
                according to the form that manifests as the orbital.
            </p>

            <NextImage
                src={pic92}
                alt="The Shape of Nodes in Orbital"
                width="300"
                caption={
                    <>
                        <strong>The Shape of Nodes in Orbital</strong> What if
                        the nodes are electron-Ether?
                    </>
                }
                center
            />

            <p>
                In order to better illustrate the perspective of Ether,
                let&apos;s establish a notation using circles and lines.{' '}
                <code>[X]</code> represents <code>1s</code>, <code>[O]</code>{' '}
                represents <code>2s</code>, and <code>[OO]</code> represents{' '}
                <code>3s</code>. <code>[-]</code> stands for <code>2p</code>,{' '}
                <code>[-O]</code> represents <code>3p</code>, and{' '}
                <code>[--O]</code> signifies <code>4d</code>. As the digit
                increases, for readability, we will also use a notation like{' '}
                <code>[2-5O]</code> to represent <code>[--OOOOO]</code>. When
                there are multiple electrons, for example,{' '}
                <code>
                    1s<sup>2</sup>
                </code>{' '}
                can be denoted as <code>[X]2</code>, and{' '}
                <code>
                    2s<sup>2</sup>
                </code>{' '}
                as <code>[O]2</code>. The data used below is referenced from{' '}
                <Link
                    href="https://physics.nist.gov/PhysRefData/ASD/lines_form.html"
                    target="_blank"
                    rel="noreferrer"
                >
                    NIST
                </Link>
                .
            </p>

            <p>
                What I want to demonstrate through this is that there is a
                pattern in the accumulation based on circular and linear shapes.
                The transition of values in multi-electron atoms follows a
                regular trend, much like in hydrogen atoms. I aim to show that
                the emitted energy is the sum of Ether and that I need a
                reference point, similar to the Rydberg formula for
                hydrogen-like atoms, to explain this trend.
            </p>

            <p>
                First, let&apos;s observe the change in circular Ether values in
                hydrogen and helium. It involves variations such as{' '}
                <code>[X]</code>, <code>[O]</code>, <code>[OO]</code>, and so
                on.
            </p>

            <NextImage
                src={pic55}
                alt="Hydrogen and Helium's Circular Ether Values"
                caption={
                    <>
                        <strong>
                            Hydrogen and Helium&apos;s Circular Ether Values
                        </strong>{' '}
                        The graph represents the Rydberg formula, and helium is
                        located in the top right corner.
                    </>
                }
                center
                width={600}
            />

            <p>
                When the graph is shifted vertically and horizontally, it
                appears as if it might overlap. Although it is repeatedly
                emphasized not to use the Rydberg formula for multi-electron
                atoms, the temptation is irresistible. I will attempt to create
                a reference equation by modifying the Rydberg formula. Spoiler
                alert: finding a perfect equation without any errors in this
                process would be a great achievement, but beware! I haven&apos;t
                found that method. However, I aim to find an equation that
                approximates it as closely as possible.
            </p>

            <h2>Shifting a Graph</h2>

            <NextImage
                src={pic56}
                alt="Helium's s and p Orbitals"
                caption="Helium's s and p Orbitals"
                center
                width={600}
            />

            <p>
                Let&apos;s examine the changes in the helium orbitals. Hydrogen
                is not suitable for this analysis due to its very small errors.
                Each color represents s and p orbitals with the same term
                symbols (e.g.,{' '}
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
                ). Consider these values as the result of the Rydberg formula
                being shifted left and right. Then, it might be possible to
                create graphs for each orbital by modifying the Rydberg formula.
                Let&apos;s use the ionization energy values as convergence
                points. The ionization energy of hydrogen is{' '}
                <code>13.60676328</code>. Let&apos;s assume the ratio for the
                graphs is same with hydrogen. The ionization energy of helium is{' '}
                <code>24.58556828</code>. This can be expressed in the following
                equation. In the upcoming equations, R will be represented with
                Arabic numerals separated by a dot (.) for the atomic and ion
                numbers, while the ether or orbital values will be indicated
                below it.
            </p>

            <Latex caption="Rydberg formula of hydrogen (eV)">{` R^{1.1}(x) = 13.60676328 \\cdot (1 - \\dfrac{1}{(x + 1)^2}) `}</Latex>
            <Latex caption="Rydberg formula of helium (eV)">{`R^{2.1}(x) = 13.60676328 \\cdot (1 - \\dfrac{1}{(x + 1)^2}) + 24.58556828 - 13.60676328`}</Latex>

            <p>
                It is vertically shifted Rydberg formula to match the height of
                helium
            </p>

            <NextImage
                src={pic57}
                alt="the Rydberg Formula Shifted Vertically to Match Helium"
                caption="the Rydberg Formula Shifted Vertically to Match Helium"
                center
                width={600}
            />

            <p>
                It seems to fit together nicely. Now, let&apos;s try horizontal
                movement. The ratio of the graph, <code>13.60676328</code>, is
                denoted as <code>r</code> (radius), and the difference between
                the vertical shift values,{' '}
                <code>24.58556828 - 13.60676328</code>, is denoted as{' '}
                <code>s</code> (shift). The horizontal shift value is
                substituted with <code>k</code>.
            </p>

            <Latex>{`w = r \\cdot (1 - \\dfrac{1}{(v + 1 + k)^2}) + s`}</Latex>

            <p>
                In the given equation, if we substitute <code>w</code> with the
                energy of <code>[O]</code>
                ether and <code>v</code> with the ether&apos;s number,{' '}
                <code>1</code>, then adjusting the graph to the first position
                will result in horizontal movement. Now, let&apos;s formulate
                the equation for the horizontal shift value <code>k</code>.
            </p>

            <Latex>{`w = r \\cdot (1 - \\dfrac{1}{(v + 1 + k)^2}) + s`}</Latex>

            <Latex>{`\\to \\dfrac{w - s}{r} = 1 - \\dfrac{1}{(v + 1 + k)^2}`}</Latex>

            <Latex>{`\\to 1 - \\dfrac{w - s}{r} = \\dfrac{1}{(v + 1 + k)^2}`}</Latex>

            <Latex>{`\\to \\dfrac{1}{1 - \\dfrac{w - s}{r}} = (v + 1 + k)^2`}</Latex>

            <Latex>{`\\to \\dfrac{1}{\\sqrt{1 - \\dfrac{w - s}{r}}} = v + 1 + k`}</Latex>

            <Latex>{`\\to k = \\dfrac{1}{\\sqrt{1 - \\dfrac{w - s}{r}}} - v - 1`}</Latex>

            <p>
                Sure, let&apos;s substitute the expression we derived for the
                horizontal shift value k back into the original equation.
            </p>

            <Latex>{`R(x, r, s, v, w) = r \\cdot (1 - \\dfrac{1}{(x + 1 + \\dfrac{1}{\\sqrt{1 - \\dfrac{w - s}{r}}} - v - 1)^2}) + s`}</Latex>

            <Latex>{`\\to R(x, r, s, v, w) = r + s - \\dfrac{r}{(x + \\dfrac{1}{\\sqrt{1 - \\dfrac{w - s}{r}}} - v)^2}`}</Latex>

            <Latex>{`\\to R(x, r, s, v, w) = r + s - \\dfrac{r}{(x - v + \\dfrac{1}{\\sqrt{\\dfrac{r - w + s}{r}}})^2}`}</Latex>

            <Latex>{`\\to R(x, r, s, v, w) = r + s - \\dfrac{r}{(x - v + \\sqrt{\\dfrac{r}{r - w + s}})^2}`}</Latex>

            <p>
                Here, <code>r + s</code> represents the peak of the graph,
                equivalent to the ionization energy. Let&apos;s denote{' '}
                <code>r + s</code> as <code>p</code> (peak)
            </p>

            <Latex caption="Modified Rydberg formula with vertical and horizontal shifting.">{`R(x, r, p, v, w) = p - \\dfrac{r}{(x - v + \\sqrt{\\dfrac{r}{p - w}})^2}`}</Latex>

            <p>
                <code>r</code> represents the ratio of the graph and is the peak
                of the hydrogen-like atom in the same phase. In other words, the{' '}
                <code>r</code> value for helium is the same as that for
                hydrogen, and the <code>r</code> value for Li II is the same as
                that for He II. <code>p</code>represents the peak and
                convergence value of the graph, which is equivalent to the
                ionization energy. When values are substituted, the graph of the
                s and p orbitals of helium looks as follows.
            </p>

            <NextImage
                src={pic58}
                alt="The Graphs of Helium's s and p Orbitals"
                caption={
                    <>
                        <strong>
                            The Graphs of Helium&apos;s s and p Orbitals
                        </strong>{' '}
                        Aren&apos;t thy beautiful?
                    </>
                }
                center
                width={600}
            />

            <p>
                In another example, when expressing the equation for
                lithium&apos;s{' '}
                <code>
                    <sup>2</sup>S<sub>1/2</sub>
                </code>
                , shifted to{' '}
                <code>
                    1s<sup>2</sup>3s
                </code>{' '}
                as <code>[X]2[OO]</code> notation, it can be formulated as
                follows. Substituting hydrogen&apos;s <code>r</code> value (
                <code>13.60676328</code>), lithium&apos;s ionization energy{' '}
                <code>s</code> value (<code>5.39114472</code>), and the emission
                energy at the 2nd position (<code>3.373129</code>):
            </p>

            <Latex>{`R^{3.1}_{2S.1/2}(x) = R(x, 13.60676328, 5.39114472, 2, 3.373129)`}</Latex>

            <NextImage
                src={pic59}
                alt="The Graphs of Lithium's s Orbital"
                caption={
                    <>
                        <strong>The Graphs of Lithium&apos;s s Orbital</strong>
                        <p>It&apos;s beautiful too</p>
                    </>
                }
                center
                width={600}
            />

            <h2>How to Shift Horizontally</h2>

            <p>
                Now, by simply plugging in the values into the equation, the
                graph will shift vertically and horizontally. However, it raises
                the question of what values to use as a reference and how much
                to move them for a meaningful comparison. Since the reference
                equation must remain consistent, continuously shifting the graph
                may not be practical. Let&apos;s examine the values for the
                helium orbitals.
            </p>

            <Table>
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
                What should be placed in an empty space? Before{' '}
                <code>[X][--]</code>, let&apos;s position <code>[X][-]</code>,
                which represents a value where the spherical orbital
                doesn&apos;t exist. In this case, we can shift the s orbital
                symmetrically to the reference graph, and for the rest, we can
                move them by the same amount as the horizontal shift of the p
                orbitals.
            </p>

            <NextImage
                src={pic93}
                alt="Horizontal Shifting of Helium Orbital Values"
                caption="Horizontal Shifting of Helium Orbital Values"
                center
                width={600}
            />

            <p>
                If done this way, all points can be aligned towards the
                reference graph. Some may wonder why we are shifting the values
                left or right. However, this is exactly the same concept as
                shifting an equation horizontally. After shifting the equation,
                both the equation and the points must be moved simultaneously to
                create a unified reference equation. This allows for a
                comparison of all values against a single reference. Let&apos;s
                substitute the s orbital into the shifting equation and
                calculate the shift.
            </p>

            <Latex>{`k = \\dfrac{1}{\\sqrt{1 - \\dfrac{w - s}{r}}} - v - 1`}</Latex>
            <Latex>{`\\to k_{s} = \\dfrac{1}{\\sqrt{1 - \\dfrac{20.6157751334 - (24.58556828 - 13.60676328)}{13.60676328}}} - 1 - 1`}</Latex>
            <Latex caption="If we move all points in the x-axis direction by this amount, they will align with the reference Rydberg formula.">{`\\to k_{s} = −0.148628918071`}</Latex>

            <NextImage
                src={pic113}
                alt="s, p, and d Orbitals"
                caption="s, p, and d Orbitals"
                center
                width={600}
            />

            <p>
                The s orbital has a lower value (shifting graph to the right),
                while orbitals like p and d containing linear ether are
                clustered to the left. Let&apos;s move the orbitals excluding s
                towards the next state, represented by <code>[-]</code>.
            </p>

            <p>
                The k<sub>p</sub> value for moving the p orbital in the{' '}
                <code>[X][-]</code>
                direction is <code>0.00897479319406</code>. Now, let&apos;s
                substitute these values and redraw the table. This time, I will
                represent them in coordinates instead of values.
            </p>

            <Table>
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

            <p>The result graph is like below:</p>

            <NextImage
                src={pic94}
                alt="The Horizontal Shifting Graph of Helium Orbitals"
                caption="The Horizontal Shifting Graph of Helium Orbitals"
                center
                width={600}
            />

            <p>
                The purpose of this document is to demonstrate the accumulation
                of ether. Therefore, instead of looking at the total energy, we
                should focus on the energy changes at each stage. The increase
                in energy from <code>[X][O]</code> to <code>[X][OO]</code>{' '}
                should be compared by examining the difference between the two
                values and <InlineMath>{`R(2+k_{s}) - R(1+k_{s})`}</InlineMath>.
            </p>

            <Latex>{`a = 22.920317682 - 20.6157751334 = 2.3045425486`}</Latex>
            <Latex>{`b = R(2+k_{s}) - R(1+k_{s}) = 2.29784533694`}</Latex>
            <Latex>{`a - b = 0.00669721166409`}</Latex>
            <Latex
                caption={
                    <>
                        The difference D(x) when energy is emitted from energy v
                        <sub>2</sub> to v<sub>1</sub>
                        in the modified Rydberg formula.
                    </>
                }
            >{`\\to D(x) = v_2 - v_1 - (R(x+1+k_{2}) - R(x+k_{1}))`}</Latex>

            <p>The table below is shifting result for all values:</p>

            <Table>
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

            <p>Let&apos;s move them to a graph:</p>

            <NextImage
                src={pic95}
                alt="Changes in the Helium Orbital Values"
                caption="Changes in the Helium Orbital Values"
                center
                width={600}
            />

            <p>
                This way, we can compare the energy changes, which represent the
                differences in all measured values, on the same standardized
                basis. The values also seem quite consistent, making them very
                suitable for representation on a single graph. The error is also
                very small. It looks delightful at every glance. In the next
                section, through actual comparisons and interpretations, I aim
                to explore whether we can consider the emission energy of an
                atom as the accumulation of ether
            </p>

            <PrevNext
                prev={{
                    title: 'Proof(1): Classic Physics',
                    link: '/ether/document/classic-physics',
                }}
                next={{
                    title: 'Proof(3): Emission Energy Analysis',
                    link: '/ether/document/analysis',
                }}
            ></PrevNext>
        </Wrapper>
    )
}
