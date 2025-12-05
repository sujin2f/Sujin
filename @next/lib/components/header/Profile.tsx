'use client'
import { useMemo } from 'react'
/* Components */
import Button from '@common/components/forms/Button'
/* Utils */
import { useNextClient } from '@lib/hooks/useNextClient'
import { useLogInOut } from '@lib/hooks/useLogInOut'
import { useUserInfo } from '@lib/hooks/useUserInfo'

const classNameButton = 'flex items-center justify-center bg-primary rounded-full p-0.5 h-9 min-md:pr-2.5'
const classNamePicture = 'flex items-center justify-center w-8 h-8 rounded-full bg-white min-md:mr-1'

/**
 * Login/out
 */
export const Profile = () => {
    const isClient = useNextClient()
    const { login, logout } = useLogInOut()
    const user = useUserInfo()

    const pathname = useMemo<string>(() => {
        if (!isClient) {
            return ''
        }
        return window.location.pathname === '/' ? 'root' : window.location.pathname
    }, [isClient])

    return (
        <>
            {user ? (
                <Button className={classNameButton} onClick={() => logout(pathname)}>
                    {user.picture && (
                        <picture className={classNamePicture}>
                            <img
                                src={user.picture}
                                alt={'Profile'}
                                width={35}
                                height={35}
                                loading="lazy"
                                className="w-8 h-8"
                            />
                        </picture>
                    )}
                    <span>Logout</span>
                </Button>
            ) : (
                <Button className={classNameButton} onClick={() => login(pathname)}>
                    <picture className={classNamePicture}>
                        <source
                            media="(max-width: 599px)"
                            type="image/webp"
                            width="35"
                            height="35"
                            srcSet="
                            https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw 1x,
                            https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw 2x
                          "
                        />
                        <source
                            media="(max-width: 599px)"
                            width="35"
                            height="35"
                            srcSet="
                            https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw
                          "
                        />
                        <img
                            className="w-7 h-7"
                            data-alt-override="false"
                            alt="G"
                            srcSet="
                            https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw 1x,
                            https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw 2x
                          "
                            width="35"
                            height="35"
                            loading="lazy"
                            src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw"
                        />
                    </picture>
                    <span className="max-md:hidden text-white font-light text-xs">Login</span>
                </Button>
            )}
        </>
    )
}
