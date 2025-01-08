import React, { useState, useCallback, Fragment } from 'react'

import { Banner } from 'src/frontend/scenes/layout/Banner'
import { Column } from 'src/common/components/layout/Column'
import { Row } from 'src/common/components/layout/Row'
import { SideMenu } from 'src/frontend/scenes/devtool/SideMenu'
import { Input } from 'src/common/components/forms/Input'
import { copyText } from 'src/common/utils/device'

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
import { Link } from 'react-router-dom'

const CASES: Record<string, (text: string[]) => string> = {
    camelCase: camelCase,
    PascalCase: pascalCase,
    'param-case': paramCase,
    snake_case: snakeCase,
    CONSTANT_CASE: constantCase,
    'Title Case': titleCase,
    'dot.case': dotCase,
    'path/case': pathCase,
}

function CaseTool() {
    const [textArr, setTextArr] = useState<string[]>([])

    const change = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setTextArr(preserveCase(event.target.value))
    }, [])

    return (
        <Fragment>
            <Banner
                excerpt="Convert keyword into many cases"
                title="Case Tool"
            />

            <Row>
                <Column dom="aside" large={3} small={12}>
                    <SideMenu />
                </Column>

                <Column dom="article" large={9} small={12}>
                    <Input
                        helpText="Click result to copy to the clipboard."
                        id="convert-keyword"
                        label="Keyword"
                        onChange={change}
                        type="text"
                    />

                    {textArr.length > 0 && (
                        <Row className="casetool__result" dom="dl" fullWidth>
                            {Object.keys(CASES).map((key) => {
                                const converted = CASES[key](textArr)

                                return (
                                    <Column
                                        key={`case-tool-${key}`}
                                        large={6}
                                        medium={12}
                                    >
                                        <dt>{key}</dt>

                                        <dd className="lead">
                                            <Link
                                                onClick={() =>
                                                    copyText(converted)
                                                }
                                                to="#"
                                            >
                                                <code data-lang="txt">
                                                    {converted}
                                                </code>
                                            </Link>
                                        </dd>
                                    </Column>
                                )
                            })}
                        </Row>
                    )}
                </Column>
            </Row>
        </Fragment>
    )
}

export default CaseTool
