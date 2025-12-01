import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'

export default function Elements() {
    return (
        <>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <h4>Heading 4</h4>
            <h5>Heading 5</h5>

            <h2>Colors</h2>
            <Row fullWidth>
                <Column small={6}>
                    <div className="color-block">
                        <div
                            style={{
                                backgroundColor: 'var(--black)',
                            }}
                        />
                        <h3>--black</h3>
                    </div>
                    <div className="color-block">
                        <div
                            style={{
                                backgroundColor: 'var(--dark-gray)',
                            }}
                        />
                        <h3>--dark-gray</h3>
                    </div>
                    <div className="color-block">
                        <div
                            style={{
                                backgroundColor: 'var(--gray)',
                            }}
                        />
                        <h3>--gray</h3>
                    </div>
                    <div className="color-block">
                        <div
                            style={{
                                backgroundColor: 'var(--light-gray)',
                            }}
                        />
                        <h3>--light-gray</h3>
                    </div>
                    <div className="color-block">
                        <div
                            style={{
                                backgroundColor: 'var(--lighter-gray)',
                            }}
                        />
                        <h3>--lighter-gray</h3>
                    </div>
                    <div className="color-block">
                        <div
                            style={{
                                backgroundColor: 'var(--white)',
                            }}
                        />
                        <h3>--white</h3>
                    </div>
                </Column>
                <Column small={6}>
                    <div className="color-block">
                        <div
                            style={{
                                backgroundColor: 'var(--primary)',
                            }}
                        />
                        <h3>--primary</h3>
                    </div>
                    <div className="color-block">
                        <div
                            style={{
                                backgroundColor: 'var(--primary-dark)',
                            }}
                        />
                        <h3>--primary-dark</h3>
                    </div>
                    <div className="color-block">
                        <div
                            style={{
                                backgroundColor: 'var(--warning)',
                            }}
                        />
                        <h3>--warning</h3>
                    </div>
                    <div className="color-block">
                        <div
                            style={{
                                backgroundColor: 'var(--pastel-red)',
                            }}
                        />
                        <h3>--pastel-red</h3>
                    </div>
                    <div className="color-block">
                        <div
                            style={{
                                backgroundColor: 'var(--pastel-blue)',
                            }}
                        />
                        <h3>--pastel-blue</h3>
                    </div>
                </Column>
            </Row>
        </>
    )
}
