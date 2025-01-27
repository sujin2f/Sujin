'use client'

import { transpose } from '@common/utils/array'
import { useEffect, useRef, useState } from 'react'

type Props = {
    children: string
    padding?: number
}

export const Table = (props: Props) => {
    const textRef = useRef<SVGTextElement[]>([])
    const text = props.children
        .split('\n')
        .map((row) => row.split('|').map((cell) => cell.trim()))
    const textArr = transpose(text)

    const xPosInitial = textArr.map((_, colIndex) => colIndex * 30)
    xPosInitial.unshift(0)
    const [xPos, setXPos] = useState(xPosInitial)
    const padding = props.padding || 5

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

    const x2 = xPos[xPos.length - 1] + padding * 2 * (xPos.length - 1)
    const y2 = 16 * xPos.length + padding * 2 * xPos.length

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <g>
                <rect
                    x={0}
                    y={0}
                    width={x2}
                    height={y2}
                    strokeWidth={1}
                    stroke="black"
                    fill="white"
                />

                {xPos.slice(1, -1).map((x, index) => (
                    <line
                        x1={x + padding * 2 * (index + 1)}
                        y1={0}
                        x2={x + padding * 2 * (index + 1)}
                        y2={y2}
                        stroke="black"
                        strokeDasharray={2}
                        strokeWidth={1}
                        key={`line-vertical-${index}`}
                    />
                ))}

                {textArr.map((_, index) => (
                    <line
                        x1={0}
                        y1={15 * (index + 1) + 2 * padding * (index + 1)}
                        x2={x2}
                        y2={15 * (index + 1) + 2 * padding * (index + 1)}
                        stroke="black"
                        strokeDasharray={2}
                        strokeWidth={1}
                        key={`line-horizontal-${index}`}
                    />
                ))}

                {textArr.map((col, colIndex) => {
                    const getRef = (element: SVGTextElement) =>
                        textRef.current.push(element) as unknown as undefined

                    return (
                        <text
                            x={xPos[colIndex] + padding * (2 * colIndex + 1)}
                            fontSize="15"
                            key={`col-${colIndex}`}
                            ref={getRef}
                        >
                            {col.map((cell, cellIndex) => (
                                <tspan
                                    x={
                                        xPos[colIndex] +
                                        padding * (2 * colIndex + 1)
                                    }
                                    dy={
                                        15 + (cellIndex ? padding * 2 : padding)
                                    }
                                    key={`cell-${colIndex}-${cellIndex}`}
                                >
                                    {cell}
                                </tspan>
                            ))}
                        </text>
                    )
                })}
            </g>
        </svg>
    )
}
