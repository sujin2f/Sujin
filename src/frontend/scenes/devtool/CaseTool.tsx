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

const CaseTool = (): JSX.Element => {
    const [textArr, setTextArr] = useState<string[]>([])

    const change = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setTextArr(preserveCase(event.target.value))
    }, [])

    return (
        <Fragment>
            <Banner
                title="Case Tool"
                excerpt="Convert keyword into many cases"
            />
            <Row>
                <Column small={12} large={3} dom="aside">
                    <SideMenu />
                </Column>
                <Column small={12} large={9} dom="article">
                    <Input
                        id="convert-keyword"
                        type="text"
                        onChange={change}
                        label="Keyword"
                        helpText="Click result to copy to the clipboard."
                    />
                    {textArr.length > 0 && (
                        <Row dom="dl" fullWidth className="casetool__result">
                            {Object.keys(CASES).map((key) => {
                                const converted = CASES[key](textArr)
                                return (
                                    <Column
                                        large={6}
                                        medium={12}
                                        key={`case-tool-${key}`}
                                    >
                                        <dt>{key}</dt>
                                        <dd className="lead">
                                            <code
                                                onClick={() =>
                                                    copyText(converted)
                                                }
                                                data-lang="txt"
                                            >
                                                {converted}
                                            </code>
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
