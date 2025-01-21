'use client'
import React, { useMemo } from 'react'
import {
    redirect,
    useParams,
    useSearchParams,
    usePathname,
} from 'next/navigation'
import Link from 'next/link'
/* Components */
import { Button } from '@common/components/forms/Button'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'
/* Helpers */
import { periodicTable } from '@src/constants/spectra'
import { getAtom } from '@src/utils/ether'
import { romanize } from '@common/utils/number'
import { Select } from '@common/components/forms/Select'

type Props = {
    terms: string[]
}

export const DataHeader = ({ terms }: Props) => {
    const path = usePathname()
    const searchParams = useSearchParams()
    const term = (searchParams && searchParams.get('term')) || ''
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

    const options: Record<string, string> = terms.reduce(
        (acc, cur) => ({
            ...acc,
            [cur]: cur,
        }),
        {},
    )
    const onTermChange = (value: string) => {
        if (value) {
            redirect(`?term=${value}`)
        } else if (path) {
            redirect(path)
        }
    }

    return (
        <aside className="header--ether">
            <Row dom="nav" className="header--ether__atom">
                <Column small={4}>
                    {prev && (
                        <Link href={`/ether/data/${type}/${prev.number}/1`}>
                            {prev.name}
                        </Link>
                    )}
                </Column>
                <Column small={4}>
                    <h1 className="text--center">
                        {periodicTable[atom - 1].name} {romanize(ion)}
                    </h1>
                </Column>
                <Column small={4} className="text--right">
                    {next && (
                        <Link href={`/ether/data/${type}/${next.number}/1`}>
                            {next.name}
                        </Link>
                    )}
                </Column>
            </Row>
            <Row dom="nav" className="header--ether__type">
                <Column small={6} className="text--right">
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
                </Column>
                <Column small={6}>
                    <Select
                        options={{ '': 'Term', ...options }}
                        value={term}
                        onChange={onTermChange}
                    />
                </Column>
            </Row>
        </aside>
    )
}
