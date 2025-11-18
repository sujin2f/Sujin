'use client'

import { map, transpose } from '@sujin/share/utils/array'
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

export const Table = (props: Props) => {
    const textRef = useRef<SVGTextElement[]>([])
    const [[width, height, x1, y1, x2, y2], setSize] = useState<
        [number, number, number, number, number, number]
    >([0, 0, 0, 0, 0, 0])

    const text = props.children
        .split('\n')
        .filter((v) => v)
        .map((row) => row.split('|').map((cell) => cell.trim()))
    const textArr: string[][] = transpose(text)

    const xPosInitial = textArr.map(() => 0)
    xPosInitial.unshift(0)
    const [xPos, setXPos] = useState(xPosInitial)

    useEffect(() => {
        const xPos = textRef.current.reduce(
            (acc, ref) => {
                return [
                    ...acc,
                    acc[acc.length - 1] + ref.getBoundingClientRect().width,
                ]
            },
            [0],
        )
        setXPos(xPos)
    }, [])

    const fontSize = props.fontSize || 15
    const padding = props.padding || 5
    const paddings = padding * 2

    useEffect(() => {
        const width = xPos[xPos.length - 1] + paddings * (xPos.length - 1)
        const height = text.length * (fontSize + paddings)
        const x1 = !isNaN(width) ? props.x - width / 2 : props.x
        const y1 = props.y
        const x2 = !isNaN(width) ? x1 + width : x1
        const y2 = !isNaN(height) ? y1 + height : y1

        setSize([width, height, x1, y1, x2, y2])
        props.update(props.id, width, height)
    }, [fontSize, paddings, props, props.x, props.y, text.length, xPos])

    return (
        <g id={props.id}>
            {/* Table Border */}
            {!isNaN(width) && (
                <>
                    <rect
                        x={x1}
                        y={y1}
                        width={width}
                        height={height}
                        strokeWidth={1}
                        stroke="black"
                        fill="white"
                    />
                    {/* Vertical Lines */}
                    {xPos.slice(1, -1).map((position, index) => {
                        const x = paddings * (index + 1) + position + x1
                        return (
                            <line
                                x1={x}
                                y1={y1}
                                x2={x}
                                y2={y2}
                                stroke="black"
                                strokeDasharray={2}
                                strokeWidth={1}
                                key={`line-vertical-${index}`}
                            />
                        )
                    })}
                    {/* Horizontal Lines */}
                    {map(text.length - 1, (_, index) => {
                        const y = (index + 1) * (fontSize + paddings) + y1
                        return (
                            <line
                                x1={x1}
                                y1={y}
                                x2={x2}
                                y2={y}
                                stroke="black"
                                strokeDasharray={2}
                                strokeWidth={1}
                                key={`line-horizontal-${index}`}
                            />
                        )
                    })}
                </>
            )}

            {/* Texts */}
            {textArr.map((col, colIndex) => {
                const getRef = (element: SVGTextElement) =>
                    textRef.current.push(element) as unknown as undefined
                const x = xPos[colIndex] + x1 + padding * (2 * colIndex + 1)
                return (
                    <text
                        x={x}
                        y={y1 - fontSize - padding + 1}
                        fontSize={fontSize}
                        key={`col-${colIndex}`}
                        dominantBaseline="hanging"
                        ref={getRef}
                    >
                        {col.map((cell, cellIndex) => (
                            <tspan
                                x={x}
                                dy={paddings + fontSize}
                                key={`cell-${colIndex}-${cellIndex}`}
                            >
                                {cell || ' '}
                            </tspan>
                        ))}
                    </text>
                )
            })}
        </g>
    )
}
