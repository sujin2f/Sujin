'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
// import { useSession } from 'next-auth/react'
/* Components */
import { TopBar } from '@sujin/common/components/layout/TopBar'
import Menu from '@sujin/common/components/layout/Menu'
import Column from '@sujin/common/components/layout/Column'
import Row from '@sujin/common/components/layout/Row'
import Hamburger from '@app/_components/header/Hamburger'
import Search from '@app/_components/header/Search'
import Button from '@sujin/common/components/forms/Button'
/* Utils */
import { handleSignIn, handleSignOut } from '../../../.backup/api/auth/_lib/utils-client'
/* CONSTANTS */
import { MENUS } from '@app/_lib/constants'
/* T_Types */
import type { MENU_NAMES } from '@app/_lib/types'
/* Assets */
import Logo from '@app/_lib/images/logo-top-bar.svg'
import Facebook from '@app/_lib/images/facebook.svg'
import Twitter from '@app/_lib/images/twitter.svg'
import '@app/_components/header/FixedHeader.scss'
import { useSession } from 'next-auth/react'

const TOP_MENU_SCROLLED_POSITION = 80

type Props = {
    readonly menu: MENU_NAMES
    readonly className?: string
    readonly style?: Record<string, string>
}

/**
 * FixedHeader component that displays a top bar with a menu, logo, and social media links.
 * The top bar changes its appearance when the user scrolls down the page.
 *
 * @param {string} props.menu - The menu items to be displayed in the top bar.
 */
const FixedHeader = ({ className, ...props }: Props) => {
    let session
    try {
        // eslint-disable-next-line react-hooks/rules-of-hooks -- Error from Error boundary
        session = useSession()
    } catch {}
    const menu = MENUS[props.menu]
    const [scrolled, setScrolled] = useState('')

    const handleScrolled = useCallback(() => {
        if (window.scrollY > TOP_MENU_SCROLLED_POSITION && !scrolled) {
            setScrolled('scrolled')
            return
        }

        if (window.scrollY <= TOP_MENU_SCROLLED_POSITION && scrolled) {
            setScrolled('')
        }
    }, [scrolled])

    useEffect(() => {
        window.addEventListener('scroll', handleScrolled)
        return () => window.removeEventListener('scroll', handleScrolled)
    }, [handleScrolled])

    return (
        <TopBar fixed fullWidth className={className}>
            {/* For Transparent Logo */}
            <section className="top-bar__background">
                <div className="top-bar__background--white" />
                <div className="top-bar__background--transparent" />
                <div className="top-bar__background--white" />
            </section>

            <Row className="top-bar__main" dom="section">
                <Column small={6}>
                    <Hamburger menu={menu} />

                    <Menu
                        className={`show-for-large top-bar__menu__container ${scrolled}`}
                        items={menu}
                    />
                </Column>

                <Column className="hide-for-small" small={6}>
                    <Search />

                    <nav className="social-media">
                        <a
                            className="social-media--twitter"
                            href="http://twitter.com/sujin2f"
                            rel="noreferrer"
                            target="_blank"
                        >
                            <Twitter />
                        </a>
                        <a
                            className="social-media--facebook"
                            href="https://www.facebook.com/sujin1977"
                            rel="noreferrer"
                            target="_blank"
                        >
                            <Facebook />
                        </a>
                    </nav>

                    {session?.data?.user ? (
                        <Button className="profile" onClick={handleSignOut}>
                            {session.data.user.image && (
                                <picture>
                                    <img
                                        src={session.data.user.image}
                                        alt={'Profile'}
                                        width={35}
                                        height={35}
                                        loading="lazy"
                                    />
                                </picture>
                            )}
                            <span>Logout</span>
                        </Button>
                    ) : (
                        <Button className="profile" onClick={handleSignIn}>
                            <picture>
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
                                    className="google"
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
                            <span>Login</span>
                        </Button>
                    )}
                </Column>
            </Row>

            <section className="top-bar__logo__container">
                <Link className="top-bar__logo" href="/">
                    <Logo />
                </Link>
            </section>
        </TopBar>
    )
}

export default FixedHeader
