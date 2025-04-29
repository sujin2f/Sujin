'use client'
import Wrapper from '@app/_components/Wrapper'
// import { A_Error, UnauthorizedError } from '@common/model/Error'

export default function GlobalError({
    error,
}: {
    error: Error & { digest?: string }
    reset?: () => void
}) {
    const title = error.name !== 'Error' ? error.name : 'Something went wrong'
    return (
        <Wrapper
            className="wrapper--frontpage sujin"
            title={title}
            excerpt={error?.message}
        />
    )
}
