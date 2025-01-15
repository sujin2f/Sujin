'use client'

import { useEffect } from 'react'

import { Image } from '@app/(public)/ether/(document)/document/image'
import { MenuNames } from '@src/constants/mysql-query'
import { useContext } from '@src/store'
import { setBanner, setMenu, setWrapperClass } from '@src/store/actions'
import { ScrollToTop } from '@app/components/ScrollToTop'

import pic13 from '@src/images/ether/pic13_eng.png'
import pic14 from '@src/images/ether/pic14_eng.png'
import pic15 from '@src/images/ether/pic15.png'
import pic124 from '@src/images/ether/pic124.jpeg'

export default function Intro() {
    const [, dispatch] = useContext()

    useEffect(() => {
        dispatch(setMenu(MenuNames.ETHER))
        dispatch(setWrapperClass(''))
        dispatch(
            setBanner({
                title: 'Conclusion',
                excerpt: '',
                icon: undefined,
                prefix: undefined,
                background: undefined,
                backgroundColor: undefined,
            }),
        )
    }, [dispatch])

    return (
        <>
            <ScrollToTop />
            <ul>
                <li>Rydberg is magnificent, sir.</li>

                <li>
                    The energy levels of multi-electron atoms can be explained
                    by the Rydberg formula through vertical and horizontal
                    shifts. Therefore, Rydberg is magnificent, sir.
                </li>

                <li>
                    Assuming that the nodes of the orbitals are photon-ether,
                    there is a high possibility that there are rules (patterns)
                    governing the energy at which photon-ether accumulate.
                </li>

                <li>
                    Placing the orbits in order of circular ether reveals
                    distinct patterns. Therefore, a reassessment of the orbital
                    classification method based on the linear ether counts of s,
                    p, d orbitals may be necessary.
                </li>

                <li>
                    Further exploration of horizontal movements may lead to the
                    creation of a new equation describing Hunt&apos;s rules.
                </li>

                <li>
                    In summary, there is a possibility that the energy levels of
                    electrons involve addition.
                </li>
            </ul>

            <p>
                It is challenging to determine whether what has been described
                so far provides sufficient evidence to prove the existence of
                ether. Although it may be premature to call the nodes of the
                orbitals as photon-ether, considering them as material with
                mass, I believe it is still too early. However, I am confident
                that we can more clearly explain the quantum nature of the
                energy levels of electrons with my explanation. This is because
                a spark of light transitioning into photon-ether in an instant
                is likely to possess the property of quantity. In this
                concluding section, under the assumption that this hypothesis is
                correct, I will organize other possibilities that can be
                considered later. Of course, the notion that this could be
                purely speculative is an underlying premise throughout this
                document.
            </p>

            <h3>(1-1) Where is time?</h3>

            <p>
                According to the theory of relativity, the speed of matter
                affects its mass and time. If we consider the increase in mass
                as an increase in the density of ether, then the spark within it
                will naturally slow down. The slowing down of the speed of
                particles that make up us could imply that time is flowing
                slowly for us. Could the perceived time be related to the speed
                of the sparks that make us up?
            </p>

            <p>
                The assumption above illustrates the position of time. The
                universe is spacetime. However, according to the assumption,
                time becomes a property of matter. Each piece of matter becomes
                an entity with its own time. The universe is an empty space
                without time, and matter becomes spacetime.
            </p>

            <p>
                If time does not exist in the universe, what changes might
                occur? With my limited knowledge, nothing would happen.
                Let&apos;s assume a universe with only one planet. This planet
                is moving at a constant velocity. The particles that make up the
                planet each have their own time, but their times would be the
                same because they are in the same inertial frame. From this
                perspective, the velocity is constant. It&apos;s not a relative
                concept. Relative velocity only arises when an observer is
                present. Now let&apos;s assume an observer. Velocity, mass, and
                time become relative concepts. &ldquo;Oh, that planet is moving
                at n km/s relative to me. Time dilation is occurring relative to
                me on that planet. The relative mass of that planet is heavier
                than mine.&rdquo; These are observed based on the properties the
                observer has.
            </p>

            <p>Time is the speed of sparks and a property of matter.</p>

            <h3>(1-2) Time Dilation</h3>

            <p>
                If time is a property of matter, it is a force and energy. When
                the property of speed increases, the property of mass (gravity)
                also increases, and conversely, the property of time decreases.
                Thus, the forces of gravity and time change oppositely based on
                the property of velocity. This is similar to the relationship
                between electricity and magnetism. If electricity is essentially
                magnetism, and magnetism is essentially electricity, gravity and
                time might also share the same essence. The fact that light has
                a constant speed everywhere might be because it is not bound by
                ether. It&apos;s a free sparkle without ether.
            </p>

            <div className="align__center">
                <Image
                    src={pic14}
                    alt="Time Dilation under Ether-Sparkle Perspective"
                />
                <p>
                    <strong>
                        Time Dilation under Ether-Sparkle Perspective
                    </strong>
                    <br />
                    Time is a property of matter, and it&apos;s changeable
                </p>
            </div>

            <p>
                Applying this, we can explain time dilation more neatly. In
                different inertial systems, in different gravities, the speed of
                sparks changes, leading to a change in time. It&apos;s not that
                time exists in our universe, but each piece of matter has its
                own time. The time of the many pieces of matter that make us up
                would also flow differently. Time would flow differently within
                the same physical system, just as the mass difference between a
                proton and an electron. And this could be the reason why atomic
                clocks are precise. Matter possesses time.
            </p>

            <h3>(1-3) Absolute Time and Absolute Velocity</h3>

            <p>
                If time is a property of matter, another property that changes
                it is velocity. Then, what velocity and time do we possess? We
                orbit around the Sun, and the solar system revolves around our
                galaxy. Our galaxy? We exist in such an inertial system. In an
                inertial system with a smaller velocity, the sparks will move
                faster, and the magnitude of time will increase. So, could there
                be an inertial frame with absolute time somewhere? The slowest
                place in the universe, where time flows the fastest.
            </p>

            <div className="align__center">
                <Image src={pic124} alt="Finding Absolute Time" />
                <p>
                    <strong>Finding Absolute Time</strong>
                </p>
            </div>

            <p>
                Let&apos;s conduct a thought experiment. Place two measuring
                devices on an orbital path. Device 2 is stationary, and Device 1
                is moving at twice the speed of Earth&apos;s orbit. From the
                perspective of Earth, both devices will be moving away
                relatively equally. Will their times be the same? If we launch
                measuring devices in the direction of the Sun&apos;s orbit
                around our galaxy, will their times be the same? This is easily
                predictable. They would, of course, be different.
            </p>

            <p>
                Expanding this further, if we launch measuring devices in
                various directions from Earth, we might be able to understand in
                which direction our galaxy is moving. Combining these, could we
                find absolute time? The answer would be yes if our galaxy moves
                in a specific direction, at a specific speed, reaching absolute
                time. Of course, this thought assumes that our galaxy is not
                influenced by external celestial bodies, and in reality, the
                influences of our galactic neighborhood could be significant.
            </p>

            <h3>(2) Double-Tunnel Experiment</h3>

            <div className="align__center">
                <Image src={pic13} alt="Double-Tunnel Experiment" />
                <p>
                    <strong>Double-Tunnel Experiment</strong> Splitting ether,
                    where is sparkle at?
                </p>
            </div>

            <p>
                One such experiment involves creating a double tunnel instead of
                a double slit. If we elongate the double slit to create a
                tunnel-like structure and confine electrons within it, what
                would happen? Ether divided into A and B sections would occupy
                each tunnel, and sparks would travel between the two ethers.
                Observing this, electrons in each tunnel would probabilistically
                exist, and when observed simultaneously, they would appear in
                only one tunnel. One ether could vanish, possibly being absorbed
                beyond space into the other ether. If not, the universe would
                overflow with split ethers, making it unstable.
            </p>

            <p>
                Surprisingly, this scenario has been experimentally validated.
                In the experiment, a neutron was passed through two channels,
                altering its spin in each. The spin change was observed to
                influence both sides.{' '}
                <a
                    href="https://journals.aps.org/prresearch/abstract/10.1103/PhysRevResearch.4.023075"
                    target="_blank"
                    rel="noreferrer"
                >
                    Quantifying the presence of a neutron in the paths of an
                    interferometer
                </a>
            </p>

            <h3>(3) Separated Ether is Quantum Entanglement?</h3>
            <div className="align__center">
                <Image
                    src={pic15}
                    alt="The Quantum Entanglement under Ether-Sparkle Perspective"
                />
                <p>
                    <strong>
                        The Quantum Entanglement under Ether-Sparkle Perspective
                    </strong>
                    <br />
                    Sparks behave as if two ethers are one
                </p>
            </div>

            <p>
                According to the hypothesis, the electron-ether demonstrated
                division by the photon-ether. In the double-slit experiment, the
                electron-ether also splits into two. Sparks within the divided
                ethers freely traverse both sides. Even when one ether is
                separated in the coordinate space as we perceive it, it
                functions as the same ether. Quantum entanglement might arise
                from the properties of ethers, cautiously suggesting such an
                opinion.
            </p>

            <div className="align__center" style={{ marginTop: '100px' }}>
                <p>
                    <strong>Fin</strong>
                </p>
            </div>
        </>
    )
}
