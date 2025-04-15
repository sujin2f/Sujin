import Wrapper from '@app/_components/Wrapper'
import Callout from '@common/components/containers/Callout'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
import Table from '@common/components/containers/Table'
import Input from '@common/components/forms/Input'
import Select from '@common/components/forms/Select'
import Switch from '@common/components/forms/Switch'
import InputGroup from '@common/components/forms/InputGroup'
import Code from '@common/components/containers/Code'
import { MENU_NAMES } from '@app/_lib/types'

export default async function Page() {
    return (
        <Wrapper
            title="Elements"
            prefix="Design System"
            menu={MENU_NAMES.DESIGN_SYSTEM}
        >
            <h2>Colors</h2>
            <Row fullWidth>
                <Column small={6}>
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
                </Column>
                <Column small={6}>
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
                </Column>
            </Row>

            <h2>Code</h2>
            <Code lang="javascript">{`<Code lang="">code</Code>`}</Code>

            <h2>Callout</h2>
            <Callout closeButton dom="section">
                Message
            </Callout>
            <h3>Example</h3>
            <Code lang="javascript">{`<Callout closeButton dom="section">
    Message
</Callout>`}</Code>

            <h2>Table</h2>
            <Table>
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
            </Table>
            <h3>Example</h3>
            <Code lang="javascript">{`<Table>
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
            <h3>Example</h3>
            <Code lang="javascript">{`<Input
    label="Label"
    placeholder="Input text here..."
    helpText="This is helpText"
    errorMessage="Error!"
    required
/>`}</Code>

            <h2>Select</h2>
            <Select
                label="Label"
                helpText="This is helpText"
                required
                options={{
                    option1: 'Option 1',
                    option2: 'Option 2',
                    option3: 'Option 3',
                }}
            />
            <h3>Example</h3>
            <Code lang="javascript">{`<Select
    label="Label"
    helpText="This is helpText"
    required
    options={{
        option1: 'Option 1',
        option2: 'Option 2',
        option3: 'Option 3',
    }}
/>`}</Code>

            <h2>Switch</h2>
            <Switch />
            <h3>Example</h3>
            <Code lang="javascript">{`<Switch />`}</Code>

            <h2>Input Group</h2>
            <InputGroup
                label="Label"
                placeholder="Input text here..."
                helpText="This is helpText"
                required
            />
            <h3>Example</h3>
            <Code lang="javascript">{`<InputGroup
    label="Label"
    placeholder="Input text here..."
    helpText="This is helpText"
    required
/>`}</Code>
        </Wrapper>
    )
}
