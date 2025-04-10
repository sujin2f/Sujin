import Wrapper from '@app/_components/Wrapper'
import Callout from '@common/components/containers/Callout'
import { MENU_NAMES } from '@app/_lib/types'

export default async function Page() {
    return (
        <Wrapper
            title="Elements"
            prefix="Design System"
            menu={MENU_NAMES.DESIGN_SYSTEM}
        >
            <h2>Colors</h2>
            <div className="design-system__css__item">
                <div
                    style={{
                        backgroundColor: 'var(--black)',
                    }}
                />
                <h3>--black</h3>
            </div>
            <div className="design-system__css__item">
                <div
                    style={{
                        backgroundColor: 'var(--dark-gray)',
                    }}
                />
                <h3>--dark-gray</h3>
            </div>
            <div className="design-system__css__item">
                <div
                    style={{
                        backgroundColor: 'var(--gray)',
                    }}
                />
                <h3>--gray</h3>
            </div>
            <div className="design-system__css__item">
                <div
                    style={{
                        backgroundColor: 'var(--light-gray)',
                    }}
                />
                <h3>--light-gray</h3>
            </div>
            <div className="design-system__css__item">
                <div
                    style={{
                        backgroundColor: 'var(--lighter-gray)',
                    }}
                />
                <h3>--lighter-gray</h3>
            </div>
            <div className="design-system__css__item">
                <div
                    style={{
                        backgroundColor: 'var(--white)',
                    }}
                />
                <h3>--white</h3>
            </div>
            <div className="design-system__css__item">
                <div
                    style={{
                        backgroundColor: 'var(--primary)',
                    }}
                />
                <h3>--primary</h3>
            </div>
            <div className="design-system__css__item">
                <div
                    style={{
                        backgroundColor: 'var(--primary-dark)',
                    }}
                />
                <h3>--primary-dark</h3>
            </div>
            <div className="design-system__css__item">
                <div
                    style={{
                        backgroundColor: 'var(--warning)',
                    }}
                />
                <h3>--warning</h3>
            </div>
            <div className="design-system__css__item">
                <div
                    style={{
                        backgroundColor: 'var(--pastel-red)',
                    }}
                />
                <h3>--pastel-red</h3>
            </div>
            <div className="design-system__css__item">
                <div
                    style={{
                        backgroundColor: 'var(--pastel-blue)',
                    }}
                />
                <h3>--pastel-blue</h3>
            </div>

            <h2>Callout</h2>
            <Callout closeButton dom="section">
                Message
            </Callout>
        </Wrapper>
    )
}
