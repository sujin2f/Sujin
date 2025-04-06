import Link from 'next/link'
import Image from 'next/image'
/* Utils */
import {
    getBackgrounds,
    updateBackgrounds,
} from '@app/_lib/data/mongo/wordpress/background'
/* Components */
import { Header } from '@app/admin/backgrounds/Header'
import { PrevNext } from '@app/admin/_components/PrevNext'
import { Table } from '@common/components/containers/Table'
import { Row } from '@common/components/layout/Row'
import { Column } from '@common/components/layout/Column'

type Props = {
    params: Promise<{
        page: string
    }>
}

export default async function Backgrounds(props: Props) {
    const params = await props.params
    const page = parseInt(params.page)
    const backgrounds = await getBackgrounds()

    const refresh = async () => {
        'use server'
        await updateBackgrounds()
    }

    return (
        <>
            <Header refresh={refresh} />

            <Row dom="article" fullWidth>
                <Column small={12}>
                    <Table fullWidth>
                        <thead>
                            <tr>
                                <th>mimeType</th>
                                <th>URL</th>
                                <th>Show</th>
                            </tr>
                        </thead>
                        <tbody>
                            {backgrounds.map((background) => (
                                <tr key={`admin-background-${background.url}`}>
                                    <td>{background.mimeType}</td>
                                    <td>{background.url}</td>
                                    <td>
                                        <Link
                                            href={background.url}
                                            target="_blank"
                                        >
                                            {background.sizes?.recentPost ? (
                                                <Image
                                                    src={
                                                        background.sizes
                                                            .recentPost.url
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
