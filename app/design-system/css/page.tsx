import React from 'react'
import Wrapper from '@app/_components/Wrapper'
import { MENU_NAMES } from '@app/_lib/types'

export default async function Page() {
    return (
        <Wrapper title="CSS" menu={MENU_NAMES.DESIGN_SYSTEM}>
            <h2>Colors</h2>

            <div>
                <h3>--black</h3>
                <div
                    style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'var(--black)',
                    }}
                />
            </div>
            <div>
                <h3>--dark-gray</h3>
                <div
                    style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'var(--dark-gray)',
                    }}
                />
            </div>
            <div>
                <h3>--gray</h3>
                <div
                    style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'var(--gray)',
                    }}
                />
            </div>
            <div>
                <h3>--light-gray</h3>
                <div
                    style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'var(--light-gray)',
                    }}
                />
            </div>
            <div>
                <h3>--lighter-gray</h3>
                <div
                    style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'var(--lighter-gray)',
                    }}
                />
            </div>
            <div>
                <h3>--white</h3>
                <div
                    style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'var(--white)',
                    }}
                />
            </div>
            <div>
                <h3>--primary</h3>
                <div
                    style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'var(--primary)',
                    }}
                />
            </div>
            <div>
                <h3>--primary-dark</h3>
                <div
                    style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'var(--primary-dark)',
                    }}
                />
            </div>
            <div>
                <h3>--warning</h3>
                <div
                    style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'var(--warning)',
                    }}
                />
            </div>
            <div>
                <h3>--pastel-red</h3>
                <div
                    style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'var(--pastel-red)',
                    }}
                />
            </div>
            <div>
                <h3>--pastel-blue</h3>
                <div
                    style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'var(--pastel-blue)',
                    }}
                />
            </div>
        </Wrapper>
    )
}
