'use client'

import { TextBox } from './TextBox'

type Props = {
    readonly id: string
    readonly x: number
    readonly y: number
    readonly padding?: number
    readonly fontSize?: number
    readonly update: (id: string, width: number, height: number) => void
    readonly children: string
}

export const TimeLine = (props: Props) => {
    return (
        <g id={props.id}>
            {/* TextBox */}
            <TextBox
                id={`timeline-${props.id}`}
                x={props.x}
                y={props.y}
                padding={props.padding}
                fontSize={props.fontSize}
                update={props.update}
            >
                {props.children}
            </TextBox>
        </g>
    )
}
