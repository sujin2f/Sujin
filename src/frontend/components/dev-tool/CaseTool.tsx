import React, { Fragment, useState, useRef } from 'react'
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'

import { Link } from 'src/frontend/components/Link'
import {
    preserveCase,
    camelCase,
    pascalCase,
    paramCase,
    snakeCase,
    constantCase,
    titleCase,
    pathCase,
    dotCase,
} from 'src/frontend/utils/dev-tools'

export const CaseTool = (): JSX.Element => {
    const [converted, setConverted] = useState<string[]>([])
    const refKeyword = useRef<HTMLInputElement>(null)

    const reset = (event: React.MouseEvent): void => {
        event.preventDefault()
        setConverted([])

        if (!refKeyword || !refKeyword.current) {
            return
        }

        refKeyword.current.value = ''
        refKeyword.current.focus()
    }

    const change = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConverted(preserveCase(event.target.value))
    }

    return (
        <Fragment>
            <aside>
                <ul>
                    <li>
                        <Link to="/dev-tools" rel="noopener noreferrer">
                            Case Tool
                        </Link>
                    </li>
                    <li>
                        <Link to="/text-sort" rel="noopener noreferrer">
                            Text Sort
                        </Link>
                    </li>
                    <li>
                        <Link to="/symbol-alignment" rel="noopener noreferrer">
                            Symbol Alignment
                        </Link>
                    </li>
                </ul>
            </aside>

            <article>
                <p className="description">Convert keyword into many cases.</p>

                <section className="input-group">
                    <span className="input-group-label">Keyword</span>
                    <input
                        id="convert-keyword"
                        className="input-group-field"
                        type="text"
                        ref={refKeyword}
                        onChange={change}
                    />

                    <div className="input-group-button">
                        <input
                            type="submit"
                            className="button"
                            onClick={reset}
                            value="Reset"
                        />
                    </div>
                </section>

                {converted.length > 0 && (
                    <Row dom="dl">
                        <Column large={6} medium={12}>
                            <dt>
                                <span className="label">camelCase</span>
                            </dt>
                            <dd className="lead">
                                <code>{camelCase(converted)}</code>
                            </dd>
                        </Column>

                        <Column large={6} medium={12}>
                            <dt>
                                <span className="label">PascalCase</span>
                            </dt>
                            <dd className="lead">
                                <code>{pascalCase(converted)}</code>
                            </dd>
                        </Column>

                        <Column large={6} medium={12}>
                            <dt>
                                <span className="label">param-case</span>
                            </dt>
                            <dd className="lead">
                                <code>{paramCase(converted)}</code>
                            </dd>
                        </Column>

                        <Column large={6} medium={12}>
                            <dt>
                                <span className="label">snake_case</span>
                            </dt>
                            <dd className="lead">
                                <code>{snakeCase(converted)}</code>
                            </dd>
                        </Column>

                        <Column large={6} medium={12}>
                            <dt>
                                <span className="label">CONSTANT_CASE</span>
                            </dt>
                            <dd className="lead">
                                <code>{constantCase(converted)}</code>
                            </dd>
                        </Column>

                        <Column large={6} medium={12}>
                            <dt>
                                <span className="label">Title Case</span>
                            </dt>
                            <dd className="lead">
                                <code>{titleCase(converted)}</code>
                            </dd>
                        </Column>

                        <Column large={6} medium={12}>
                            <dt>
                                <span className="label">dot.case</span>
                            </dt>
                            <dd className="lead">
                                <code>{dotCase(converted)}</code>
                            </dd>
                        </Column>

                        <Column large={6} medium={12}>
                            <dt>
                                <span className="label">path/case</span>
                            </dt>
                            <dd className="lead">
                                <code>{pathCase(converted)}</code>
                            </dd>
                        </Column>
                    </Row>
                )}
            </article>
        </Fragment>
    )
}
