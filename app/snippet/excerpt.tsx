'use client'
import { Button } from '@common/components/forms/Button'
import { handleSignIn, handleSignOut } from '@app/api/auth/utils'

export const Excerpt = ({ name }: { name?: string }) => {
    if (name) {
        return (
            <>
                <div>Welcome, {name}</div>
                <Button href="/snippet/yours/1">Go to your Snippets</Button>
                <Button onClick={handleSignOut}>Sign out</Button>
            </>
        )
    }
    return (
        <>
            <div>Click to log in with Google Account</div>
            <Button onClick={handleSignIn}>Log in</Button>
        </>
    )
}
