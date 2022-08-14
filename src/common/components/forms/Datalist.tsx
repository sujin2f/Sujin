import React from 'react'

type Props = {
    id: string
    values: string[]
}
export const Datalist = (props: Props): JSX.Element => {
    const { id, values } = props

    return (
        <datalist id={id}>
            {values.map((value, index) => (
                <option key={`${id}-datalist-${index}`} value={value} />
            ))}
        </datalist>
    )
}
