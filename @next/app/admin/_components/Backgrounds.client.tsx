'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
/* Components */
import Button from '@sujin/common/components/forms/Button'
import HeaderComponent from '@app/admin/_components/Header'
import Callout from '@sujin/common/components/containers/Callout'
import { PrevNext } from '@app/admin/_components/PrevNext'
import Row from '@sujin/common/components/layout/Row'
import Column from '@sujin/common/components/layout/Column'
import Table from '@sujin/common/components/containers/Table'
/* T_Types */
import type { T_Background } from '@app/_lib/types'
/* Utils */
import { entries } from '@sujin/common/utils/object'

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
                    <Table fullWidth>
                        <thead>
                            <tr>
                                <th>mimeType</th>
                                <th>width</th>
                                <th>height</th>
                                <th>URL</th>
                                <th>Sizes</th>
                                <th>Show</th>
                            </tr>
                        </thead>
                        <tbody>
                            {backgrounds.map((background) => (
                                <tr key={`admin-background-${background._id}`}>
                                    <td className="center">
                                        {background.mimeType}
                                    </td>
                                    <td className="center">
                                        {background.width}
                                    </td>
                                    <td className="center">
                                        {background.height}
                                    </td>
                                    <td>{background.url}</td>
                                    <td>
                                        {background.sizes ? (
                                            <ul>
                                                {entries(background.sizes).map(
                                                    ([key, value]) => (
                                                        <li
                                                            key={`image-size-${background.url}-${key}`}
                                                        >
                                                            <Link
                                                                href={value.url}
                                                                target="_blank"
                                                            >
                                                                {key}
                                                            </Link>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        ) : null}
                                    </td>
                                    <td className="center">
                                        <Link
                                            href={background.url}
                                            target="_blank"
                                        >
                                            {background.sizes?.medium ? (
                                                <Image
                                                    src={
                                                        background.sizes.medium
                                                            .url
                                                    }
                                                    width={88}
                                                    height={88}
                                                    alt=""
                                                />
                                            ) : (
                                                'Show'
                                            )}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
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
