'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
/* Components */
import Button from '@common/components/forms/Button'
import HeaderComponent from '@app/admin/_components/Header'
import { BackgroundsTable } from '@app/admin/_components/BackgroundsTable'
import Callout from '@common/components/containers/Callout'
import { PrevNext } from '@app/admin/_components/PrevNext'
import Row from '@common/components/layout/Row'
import Column from '@common/components/layout/Column'
/* T_Types */
import type { T_Background } from '@app/_lib/types'

type Props = {
    readonly refresh: () => Promise<string>
    readonly page: number
    readonly backgrounds: T_Background[]
}

export function BackgroundsClient({ refresh, page, backgrounds }: Props) {
    const [message, setMessage] = useState('')
    const router = useRouter()

    return (
        <>
            <HeaderComponent title="Backgrounds">
                <Button
                    title="Refresh All"
                    onClick={() =>
                        refresh().then((result) => {
                            setMessage(result)
                            setMessage('Backgrounds successfully updated!')
                            router.refresh()
                        })
                    }
                />
            </HeaderComponent>
            {message ? <Callout>{message}</Callout> : null}
            <Row dom="article" fullWidth>
                <Column small={12}>
                    <PrevNext
                        page={page}
                        length={backgrounds.length}
                        path="backgrounds"
                    />
                </Column>
                <Column small={12}>
                    <BackgroundsTable backgrounds={backgrounds} />
                </Column>
                <Column small={12}>
                    <PrevNext
                        page={page}
                        length={backgrounds.length}
                        path="backgrounds"
                    />
                </Column>
            </Row>
        </>
    )
}
