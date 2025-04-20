'use client'
import { useState } from 'react'

import Wrapper from '@app/_components/Wrapper'
import Callout from '@common/components/containers/Callout'
import Table from '@common/components/containers/Table'
import Input from '@common/components/forms/Input'
import Select from '@common/components/forms/Select'
import Switch from '@common/components/forms/Switch'
import InputGroup from '@common/components/forms/InputGroup'
import Code from '@common/components/containers/Code'
import { MENU_NAMES } from '@app/_lib/types'
import { Loading } from '@app/_components/archive/loading'
import { Button } from '@common/components/forms/Button'

export default function Page() {
    const [theme, setTheme] = useState('sujin')
    return (
        <Wrapper
            className={`wrapper--design-system ${theme}`}
            title="Components"
            prefix="Design System"
            menu={MENU_NAMES.DESIGN_SYSTEM}
            excerpt={
                <Button
                    onClick={() => {
                        if (theme === 'sujin') {
                            setTheme('')
                        } else {
                            setTheme('sujin')
                        }
                    }}
                    title={theme === 'sujin' ? 'Remove Theme' : 'Apply Theme'}
                />
            }
        >
            <article>
                <h2>Code</h2>
                <Code lang="javascript">{`<Code lang="">code</Code>`}</Code>
                <h2>Callout</h2>
                <Callout closeButton dom="section">
                    Message
                </Callout>
                <h3>Usage</h3>
                <Code lang="javascript">{`<Callout closeButton dom="section">
    Message
</Callout>`}</Code>
                <h2>Table</h2>
                <h3>With caption / full-Width</h3>
                <Table caption="Table Caption" fullWidth>
                    <thead>
                        <tr>
                            <th>Head</th>
                            <th>Head</th>
                            <th>Head</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Cell</td>
                            <td className="--center">Cell</td>
                            <td>Cell</td>
                        </tr>
                        <tr>
                            <td>Cell</td>
                            <td>Cell</td>
                            <td>Cell</td>
                        </tr>
                        <tr>
                            <td>Cell</td>
                            <td>Cell</td>
                            <td>Cell</td>
                        </tr>
                        <tr>
                            <td>Cell</td>
                            <td>Cell</td>
                            <td>Cell</td>
                        </tr>
                    </tbody>
                </Table>
                <h3>With caption / Center</h3>
                <Table caption="Table Caption" center>
                    <thead>
                        <tr>
                            <th>Head</th>
                            <th>Head</th>
                            <th>Head</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Cell</td>
                            <td>Cell</td>
                            <td>Cell</td>
                        </tr>
                        <tr>
                            <td>Cell</td>
                            <td>Cell</td>
                            <td>Cell</td>
                        </tr>
                        <tr>
                            <td>Cell</td>
                            <td>Cell</td>
                            <td>Cell</td>
                        </tr>
                        <tr>
                            <td>Cell</td>
                            <td>Cell</td>
                            <td>Cell</td>
                        </tr>
                    </tbody>
                </Table>
                <h3>Usage</h3>
                <Code lang="javascript">{`<Table caption="Table Caption" center fullWidth>
    <thead>
        <tr>
            <th>Head</th>
            <th>Head</th>
            <th>Head</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Cell</td>
            <td>Cell</td>
            <td>Cell</td>
        </tr>
    </tbody>
</Table>`}</Code>
                <h2>Input</h2>
                <Input
                    label="Label"
                    placeholder="Input text here..."
                    helpText="This is helpText"
                    errorMessage="Error!"
                    required
                />
                <h3>Usage</h3>
                <Code lang="javascript">{`<Input
    label="Label"
    placeholder="Input text here..."
    helpText="This is helpText"
    errorMessage="Error!"
    required
/>`}</Code>

                <h2>Textarea</h2>
                <Input
                    type="textarea"
                    label="Label"
                    placeholder="Input text here..."
                    helpText="This is helpText"
                    errorMessage="Error!"
                    required
                    rows={5}
                />

                <h2>Select</h2>
                <Select
                    label="Label"
                    helpText="This is helpText"
                    required
                    errorMessage="Error!"
                    options={{
                        option1: 'Option 1',
                        option2: 'Option 2',
                        option3: 'Option 3',
                    }}
                />
                <h3>Usage</h3>
                <Code lang="javascript">{`<Select
    label="Label"
    helpText="This is helpText"
    required
    errorMessage="Error!"
    options={{
        option1: 'Option 1',
        option2: 'Option 2',
        option3: 'Option 3',
    }}
/>`}</Code>
                <h2>Switch</h2>
                <Switch />
                <h3>Usage</h3>
                <Code lang="javascript">{`<Switch />`}</Code>
                <h2>Input Group</h2>
                <InputGroup
                    label="Label"
                    helpText="This is helpText"
                    required
                    errorMessage="Error!"
                />
                <h3>Usage</h3>
                <Code lang="javascript">{`<InputGroup
    label="Label"
    placeholder="Input text here..."
    helpText="This is helpText"
    required
/>`}</Code>

                <h2>Article Cards (Loading)</h2>
                <Loading counts={6} />
            </article>
        </Wrapper>
    )
}
