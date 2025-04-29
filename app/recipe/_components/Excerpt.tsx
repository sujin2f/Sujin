'use client'
/* Components */
import Button from '@common/components/forms/Button'
/* Utils */
import { handleSignIn, handleSignOut } from '@app/api/auth/_lib/utils'
/* T_Types */
import type { T_SessionUser } from '@app/_lib/types'

export const Excerpt = ({ user }: { user?: T_SessionUser }) => {
    if (user) {
        return (
            <>
                <div>Welcome, {user.name}</div>
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
