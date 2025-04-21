'use client'
import Wrapper from '@app/_components/Wrapper'

export default function GlobalError({
    error,
}: {
    error: Error & { digest?: string }
    reset?: () => void
}) {
    return (
        <Wrapper
            className="wrapper--frontpage sujin"
            title="Something went wrong"
            excerpt={error?.message}
        />
    )
}
