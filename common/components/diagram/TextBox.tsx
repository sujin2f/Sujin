'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
    readonly id: string
    readonly x: number
    readonly y: number
    readonly padding?: number
    readonly fontSize?: number
    readonly update: (id: string, width: number, height: number) => void
    readonly children: string
}

export const TextBox = (props: Props) => {
    const textRef = useRef<SVGTextElement>(null)
    const [[width, height, x1], setSize] = useState<[number, number, number]>([
        0, 0, 0,
    ])

    const fontSize = props.fontSize || 15
    const padding = props.padding || 5
    const paddings = padding * 2
    const textWidth = textRef.current?.getBoundingClientRect().width || 0

    useEffect(() => {
        const width = textWidth + paddings
        const height = fontSize + paddings
        const x1 = !isNaN(width) ? props.x - width / 2 : props.x

        setSize([width, height, x1])
        props.update(props.id, width, height)
    }, [paddings, props, fontSize, textWidth])

    // console.log(textHeight)

    return (
        <g id={props.id}>
            {/* Box */}
            <rect
                x={x1}
                y={props.y}
                width={width}
                height={height}
                strokeWidth={1}
                stroke="black"
                fill="white"
            />

            {/* Text */}
            <text
                x={x1 + padding}
                y={props.y + padding + 1}
                fontSize={fontSize}
                dominantBaseline="hanging"
                ref={textRef}
            >
                {props.children}
            </text>
        </g>
    )
}
