'use server'
import Link from 'next/link'
import Image from 'next/image'

/* Components */
import Table from '@common/components/containers/Table'
import Column from '@common/components/layout/Column'
import Row from '@common/components/layout/Row'
import { Header } from './Header'
/* Utils */
import { getBackgrounds } from '@lib/apollo/query/getBackgrounds'
import { entries } from '@sujin/share/utils/object'

export default async function Backgrounds() {
    const backgrounds = await getBackgrounds({
        query: `
            _id mimeType width height url
            sizes {
                medium { url }
                thumbnail { url }
                mediumLarge { url }
                postThumbnail { url }
                relatedPost { url }
                recentPost { url }
                large { url }
            }`,
    })

    return (
        <>
            <Header />
            <Row dom="article" fullWidth>
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
                                                {entries(background.sizes)
                                                    .filter(([key, value]) => {
                                                        if (
                                                            (key as string) ===
                                                            '__typename'
                                                        ) {
                                                            // TODO remove this from aggregation
                                                            return false
                                                        }
                                                        return value
                                                    })
                                                    .map(([key, value]) => (
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
                                                    ))}
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
            </Row>
        </>
    )
}
