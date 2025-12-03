import { InlineMath } from 'react-katex'
/* Components */
import { NextImage } from '@common/components/containers/NextImage'
import Table from '@common/components/containers/Table'
import { Latex } from '@lib/components/single/Latex'
import { PrevNext } from '@lib/components/single/PrevNext'
/* Assets */
import pic5 from '@lib/images/ether/pic5_eng.png'
import 'katex/dist/katex.min.css'

export default function ClassicPhysics() {
    return (
        <article style={{ counterReset: 'fig 6 tbl equ' }}>
            <h2>The emitted wavelengths of the Photon-Ether based on Bohr&apos;s atomic model</h2>

            <p>
                The wavelengths emitted by the electron can be determined using the Rydberg formula. Below is a summary
                of the Rydberg formula and the emitted wavelengths in the Lyman series, where n decreases from{' '}
                <InlineMath>n \geq 2</InlineMath> to <InlineMath>n = 1</InlineMath>, and the Paschen series, where the
                transition changes from <InlineMath>n \geq 4</InlineMath> to <InlineMath>n = 3</InlineMath>.
            </p>

            <Latex
                caption={
                    <>
                        <strong>Rydberg Formula</strong>: how did you figure it out, sir?
                    </>
                }
            >
                {`\\dfrac{1}{\\lambda} = R(\\dfrac{1}{m^2} - \\dfrac{1}{n^2}) \\hspace{10pt} \\{ R=1.0973731568539 \\times 10^7 m^{-1} \\}`}
            </Latex>

            <Table caption="Wavelength of the Lyman Series">
                <thead>
                    <tr>
                        <th>n</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                        <th>5</th>
                        <th>6</th>
                        <th>7</th>
                        <th>8</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>nm</th>
                        <td>121.50</td>
                        <td>102.51</td>
                        <td>97.20</td>
                        <td>94.92</td>
                        <td>93.73</td>
                        <td>93.02</td>
                        <td>92.57</td>
                    </tr>
                </tbody>
            </Table>

            <Table caption="Wavelength of the Paschen Series">
                <thead>
                    <tr>
                        <th>n</th>
                        <th>4</th>
                        <th>5</th>
                        <th>6</th>
                        <th>7</th>
                        <th>8</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>nm</th>
                        <td>1,874.60</td>
                        <td>1,281.46</td>
                        <td>1,093.52</td>
                        <td>1,004.67</td>
                        <td>954.34</td>
                    </tr>
                </tbody>
            </Table>

            <p>
                At first glance, it may seem that there is a decreasing pattern within the same series, but it is
                difficult to determine how the values change between different series. It is challenging to infer the
                transition from 4 to 3 using only the values in the Lyman series. We desire a consistent value for the
                spacing between n shells, so wavelengths are not suitable. However, if we express the wavelengths in
                terms of their reciprocals, called wave numbers, it can be represented as follows:
            </p>

            <Table caption="Wave Number of Lyman Series">
                <thead>
                    <tr>
                        <th>n</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                        <th>5</th>
                        <th>6</th>
                        <th>7</th>
                        <th>8</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>
                            cm<sup>-1</sup>
                        </th>
                        <td>82,302.98</td>
                        <td>97,544.28</td>
                        <td>102,878.73</td>
                        <td>105,347.82</td>
                        <td>106,689.05</td>
                        <td>107,497.77</td>
                        <td>108,022.67</td>
                    </tr>
                </tbody>
            </Table>

            <p>
                Let&apos;s focus on the gaps between the wave numbers. In other words, we will examine the values when
                transitioning from 2 to 1 and from 4 to 3.
            </p>

            <Table caption="Wave Number Differences of the Lyman Series">
                <thead>
                    <tr>
                        <th>n</th>
                        <th>
                            <InlineMath>3 \to 2</InlineMath>
                        </th>
                        <th>
                            <InlineMath>4 \to 3</InlineMath>
                        </th>
                        <th>
                            <InlineMath>5 \to 4</InlineMath>
                        </th>
                        <th>
                            <InlineMath>6 \to 5</InlineMath>
                        </th>
                        <th>
                            <InlineMath>7 \to 6</InlineMath>
                        </th>
                        <th>
                            <InlineMath>8 \to 7</InlineMath>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>
                            cm<sup>-1</sup>
                        </th>
                        <td>15,241.29</td>
                        <td>5,334.45</td>
                        <td>2,469.08</td>
                        <td>1,341.23</td>
                        <td>808.72</td>
                        <td>524.89</td>
                    </tr>
                </tbody>
            </Table>

            <Table caption="Wave Number Differences of the Paschen Series">
                <thead>
                    <tr>
                        <th>n</th>
                        <th>
                            <InlineMath>5 \to 4</InlineMath>
                        </th>
                        <th>
                            <InlineMath>6 \to 5</InlineMath>
                        </th>
                        <th>
                            <InlineMath>7 \to 6</InlineMath>
                        </th>
                        <th>
                            <InlineMath>8 \to 7</InlineMath>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>
                            cm<sup>-1</sup>
                        </th>
                        <td>2,469.08</td>
                        <td>1,341.23</td>
                        <td>808.72</td>
                        <td>524.89</td>
                    </tr>
                </tbody>
            </Table>

            <p>
                The difference in wave numbers is the same for both series. This supports the hypothesis that a specific
                energy is conserved in the space between the n shells in the form of Ether. Each corresponding
                Photon-Ether between the shells has a constant energy, and it can be interpreted as being converted into
                exactly that amount of Photon-Sparkle and emitted. Now, the absorption and emission of energy have been
                combined as additions.
            </p>

            <h2>Emission Energy of Photon-Ether</h2>

            <p>
                If photon-Ether has a constant wavelength, we can determine its energy. The energy of light can be
                calculated using the formula
                <InlineMath>E = hc / λ</InlineMath>, where λ represents the previously calculated wavelength. The value
                obtained has units of Joules (J). Converting this energy value to electron volts (eV) yields the
                following formula, and organizing it results in the table below.
            </p>

            <Latex>{`E = Rhc(\\dfrac{1}{(n - 1)^2} - \\dfrac{1}{n^2})\\cdot6.242\\cdot10^{32}`}</Latex>

            <p>Since the Rydberg constant, Planck&apos;s constant, and the speed of light are all constants,</p>

            <Latex>{`E = Rhc(\\dfrac{1}{(n - 1)^2} - \\dfrac{1}{n^2})\\cdot6.242\\cdot10^{32}`}</Latex>
            <Latex>{`E = 1.0973731568539 \\cdot 10^{-7} \\cdot 6.62607015 \\cdot 10^{-34} \\cdot 299792458 \\cdot (\\dfrac{1}{(n - 1)^2} - \\dfrac{1}{n^2}) \\cdot 6.242 \\cdot 10^{32}`}</Latex>
            <Latex caption="The formula for calculating energy (in electron volts, eV) using the Rydberg formula">{`E = 13.60676328 \\cdot (\\dfrac{1}{(n - 1)^2} - \\dfrac{1}{n^2})`}</Latex>

            <Table caption="Result Energy from the Formula">
                <thead>
                    <tr>
                        <th>n</th>
                        <th>
                            <InlineMath>2 \to 1</InlineMath>
                        </th>
                        <th>
                            <InlineMath>3 \to 2</InlineMath>
                        </th>
                        <th>
                            <InlineMath>4 \to 3</InlineMath>
                        </th>
                        <th>
                            <InlineMath>5 \to 4</InlineMath>
                        </th>
                        <th>
                            <InlineMath>6 \to 5</InlineMath>
                        </th>
                        <th>
                            <InlineMath>7 \to 6</InlineMath>
                        </th>
                        <th>
                            <InlineMath>8 \to 7</InlineMath>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>eV</th>
                        <td>10.2050</td>
                        <td>1.8898</td>
                        <td>0.6614</td>
                        <td>0.3061</td>
                        <td>0.1663</td>
                        <td>0.1002</td>
                        <td>0.0650</td>
                    </tr>
                </tbody>
            </Table>

            <p>
                In the Bohr atomic model and the Schrödinger equation for the hydrogen atom, the energy of the nth shell
                satisfies the following equation:
            </p>

            <Latex>{`E_n = -\\frac{ℏ^2}{2 \\mu a_0 ^ 2} \\frac{1}{n^2}`}</Latex>

            <p>
                By substituting <InlineMath>{`\\dfrac{1}{n^2}`}</InlineMath> with{' '}
                <InlineMath>{`(\\dfrac{1}{(n - 1)^2} - \\dfrac{1}{n^2})`}</InlineMath> and J with eV, we can observe
                that the obtained expression closely matches the one derived earlier.
            </p>

            <Latex>{`\\frac{ℏ^2}{2 \\mu a_0 ^ 2} (\\dfrac{1}{(n - 1)^2} - \\dfrac{1}{n^2}) \\hspace{10pt} \\{ n \\geqq 2 \\}`}</Latex>

            <Table>
                <thead>
                    <tr>
                        <th>n</th>
                        <th>
                            <InlineMath>2 \to 1</InlineMath>
                        </th>
                        <th>
                            <InlineMath>3 \to 2</InlineMath>
                        </th>
                        <th>
                            <InlineMath>4 \to 3</InlineMath>
                        </th>
                        <th>
                            <InlineMath>5 \to 4</InlineMath>
                        </th>
                        <th>
                            <InlineMath>6 \to 5</InlineMath>
                        </th>
                        <th>
                            <InlineMath>7 \to 6</InlineMath>
                        </th>
                        <th>
                            <InlineMath>8 \to 7</InlineMath>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>1st values</th>
                        <td>10.2050</td>
                        <td>1.8898</td>
                        <td>0.6614</td>
                        <td>0.3061</td>
                        <td>0.1663</td>
                        <td>0.1002</td>
                        <td>0.0650</td>
                    </tr>
                    <tr>
                        <th>2nd values</th>
                        <td>10.2009</td>
                        <td>1.8890</td>
                        <td>0.6611</td>
                        <td>0.3060</td>
                        <td>0.1662</td>
                        <td>0.1002</td>
                        <td>0.0650</td>
                    </tr>
                </tbody>
            </Table>

            <NextImage
                src={pic5}
                alt="Rydberg of Photon-Ether"
                caption={
                    <>
                        <strong>Rydberg of Photon-Ether</strong> simple plus calculation
                    </>
                }
                center
                width={440}
            />

            <p>
                As seen in the diagram, we can now easily determine the energy possessed by the ether through addition.
                We are now able to calculate energy, wavelength, and even mass.
            </p>

            <h2>Summary</h2>

            <p>
                Everything discussed here is quite obvious. It&apos;s basic knowledge that can be found in any classical
                physics textbook. These concepts were already well-established during Niels Bohr&apos;s time,
                specifically in the context of hydrogen atoms. However, they do not hold true for multi-electron atoms.
                You have been deceived. Haha!
            </p>
            <p>
                What I am looking for here is to present the conditions under which the ether-spark hypothesis can be
                convincing.
            </p>

            <ul>
                <li>
                    Firstly, the energy possessed by the ether should be <strong>predictable</strong>.
                </li>
                <li>
                    Secondly, the energy possessed by the ether should be obtainable through <strong>addition</strong>.
                </li>
                <li>
                    Thirdly, these conditions should hold true even for <strong>multi-electron atoms</strong>.
                </li>
            </ul>
            <p>
                If these conditions are satisfied, it would be possible to demonstrate that energy is stored in the form
                of ether. In the next section, we will delve into multi-electron atoms.
            </p>

            <PrevNext
                prev={{
                    title: 'Hypothesis',
                    link: '/ether/document/hypothesis',
                }}
                next={{
                    title: 'Proof(2): Reinterpretation of Rydberg Formula',
                    link: '/ether/document/rydberg-formula',
                }}
            ></PrevNext>
        </article>
    )
}
