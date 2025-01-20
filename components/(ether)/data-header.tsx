'use client'

import React, { useMemo } from 'react'
import { useParams } from 'next/navigation'

import { periodicTable } from '@src/constants/spectra'
import Link from 'next/link'
import { getAtom } from '@src/utils/ether'
import { romanize } from '@common/utils/number'
import { Button } from '@common/components/forms/Button'

export const DataHeader = () => {
    const params = useParams<EtherDataProps>()

    const atom = parseInt(params ? params.atom : '0')
    const ion = parseInt(params ? params.ion : '0')
    const type = params ? params.type : ''

    const prev = useMemo(() => {
        if (atom < 2) {
            return
        }
        return getAtom(atom - 1)
    }, [atom])
    const next = useMemo(() => getAtom(atom + 1), [atom])

    return (
        <aside className="header--ether--data">
            <nav>
                {prev && (
                    <Link href={`/ether/data/${type}/${prev.number}/1`}>
                        {prev.name}
                    </Link>
                )}
                <h1>
                    {periodicTable[atom - 1].name} {romanize(ion)}
                </h1>
                {next && (
                    <Link href={`/ether/data/${type}/${next.number}/1`}>
                        {next.name}
                    </Link>
                )}
            </nav>
            <nav>
                <Button
                    title="Orbital"
                    href={`/ether/data/orbital/${atom}/${ion}`}
                    hollow={type === 'ether'}
                />
                <Button
                    title="Ether"
                    href={`/ether/data/ether/${atom}/${ion}`}
                    hollow={type === 'orbital'}
                />
            </nav>
        </aside>
    )
}
