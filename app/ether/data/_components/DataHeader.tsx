'use client'
import React, { type ChangeEventHandler, useMemo } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
/* Components */
import Button from '@sujin/common/components/forms/Button'
import Row from '@sujin/common/components/layout/Row'
import Column from '@sujin/common/components/layout/Column'
import Select from '@sujin/common/components/forms/Select'
/* Helpers */
import { periodicTable } from '@app/ether/data/constants'
import { getAtom } from '@app/ether/_lib/client'
import { romanize } from '@sujin/common/utils/number'
import type { Atom } from '@app/ether/data/models/Atom'

type Props = {
    container: Atom
    atom: number
    ion: number
    type: string
    term?: string
}

export const DataHeader = (props: Props) => {
    const { ion, type, term } = props
    const container = props.container
    const atom = getAtom(props.atom)
    const prev = useMemo(() => {
        if (atom.number < 2) {
            return
        }
        return getAtom(atom.number - 1)
    }, [atom.number])
    const next = useMemo(() => getAtom(atom.number + 1), [atom.number])

    const onTermChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
        const term = e.target.value
        const url = `/ether/data/${type}/${atom.number}/${ion}`
        if (!term) {
            redirect(url)
        }
        redirect(`${url}/${term}`)
    }

    return (
        <aside className="header--ether">
            {/* Atom Navigation */}
            <Row dom="nav" className="header--ether__atom">
                <Column small={4}>
                    {prev && (
                        <Link href={`/ether/data/${type}/${prev.number}/1`}>
                            {prev.name}
                        </Link>
                    )}
                </Column>
                <Column small={4}>
                    <h1 className="--center">
                        {periodicTable[atom.number - 1].name} {romanize(ion)}
                    </h1>
                </Column>
                <Column small={4} className="--right">
                    {next && (
                        <Link href={`/ether/data/${type}/${next.number}/1`}>
                            {next.name}
                        </Link>
                    )}
                </Column>
            </Row>
            {/* Type / Term Selection */}
            <Row dom="nav" className="header--ether__type">
                <Column small={6} className="--right">
                    <Button
                        title="Orbital"
                        href={`/ether/data/orbital/${atom.number}/${ion}`}
                        hollow={type === 'ether'}
                    />
                    <Button
                        title="Ether"
                        href={`/ether/data/ether/${atom.number}/${ion}`}
                        hollow={type === 'orbital'}
                    />
                </Column>
                <Column small={6}>
                    <Select
                        options={{ '': 'Term', ...container.termOptions }}
                        value={term}
                        onChange={onTermChange}
                    />
                </Column>
            </Row>
        </aside>
    )
}
