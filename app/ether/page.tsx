/* Components */
import ScrollToTop from '@common/components/ScrollToTop'
import { PrevNext } from '@app/(single)/_components/PrevNext'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
import { Banner } from '@app/_components/header/Banner'
/* Constants */
import { MENU_NAMES } from '@app/_lib/types'
/* Types */
import type { PostType } from '@app/_lib/data/mysql/types'

export default function Intro() {
    return (
        <main>
            <ScrollToTop />
            <Banner menu={MENU_NAMES.ETHER} />
            <article>
                <Row>
                    <Column small={12} large={8} largeOffset={2}>
                        <p>
                            Substance as a composite of mass and electromagnetic
                            waves, photons as mass-independent electromagnetic
                            waves, and electromagnetic waves independent of
                            mass.
                        </p>

                        <p>since 2024 Sujin</p>

                        <h2>Abstract</h2>

                        <p>
                            This document aims to propose a new hypothesis
                            regarding the structure of matter. According to the
                            proposed hypothesis, matter can be divided into
                            particles-waves that make up mass and possess
                            electromagnetic wave properties. If matter, such as
                            electrons, is considered a composite of space and
                            particles-waves, then photons are assumed to be
                            particles-waves without space.
                        </p>

                        <p>
                            To demonstrate this, this document will explore the
                            existence of mass space without particles-waves. To
                            achieve this, the Bohr model and orbitals will be
                            reinterpreted. If phenomena observed in matter from
                            the perspective of space and particles-waves can be
                            explained more simply, it may suggest a small
                            possibility for the hypothesis.
                        </p>

                        <p>
                            The author of this document is a non-expert in the
                            field. I lack the ability to discern how
                            scientifically clear this is. The document is
                            written with as much explanation as possible to make
                            it understandable for non-experts like myself, which
                            may result in verbose explanations.
                        </p>

                        <PrevNext
                            posts={[
                                ,
                                {
                                    title: 'Hypothesis',
                                    link: '/ether/document/hypothesis',
                                } as PostType,
                            ]}
                        ></PrevNext>
                    </Column>
                </Row>
            </article>
        </main>
    )
}
