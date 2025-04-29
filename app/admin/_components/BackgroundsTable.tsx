'use client'
import Link from 'next/link'
import Image from 'next/image'
/* Components */
import TableComponent from '@common/components/containers/Table'
import { entries } from '@common/utils/object'
import type { T_Background } from '@app/_lib/types'

type Props = {
    readonly backgrounds: T_Background[]
}

export function BackgroundsTable({ backgrounds }: Props) {
    return (
        <TableComponent fullWidth>
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
                        <td className="center">{background.mimeType}</td>
                        <td className="center">{background.width}</td>
                        <td className="center">{background.height}</td>
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
                            <Link href={background.url} target="_blank">
                                {background.sizes?.medium ? (
                                    <Image
                                        src={background.sizes.medium.url}
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
        </TableComponent>
    )
}
