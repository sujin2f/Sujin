'use client'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
/* Components */
import Menu from '@common/components/layout/Menu'
import Hamburger from '@lib/components/header/Hamburger'
import Search from '@lib/components/header/Search'
import { Profile } from '@lib/components/header/Profile'
/* CONSTANTS */
import { MENUS } from '@lib/constants'
import { MENU_NAMES } from '@sujin/lib/constants'
/* Assets */
import Logo from '@common/images/logo-top-bar.svg'
import Facebook from '@common/images/facebook.svg'
import Twitter from '@common/images/twitter.svg'

const TOP_MENU_SCROLLED_POSITION = 80

type Props = {
    readonly menu: MENU_NAMES
}

/**
 * FixedHeader component that displays a top bar with a menu, logo, and social media links.
 * The top bar changes its appearance when the user scrolls down the page.
 *
 * @param {string} props.menu - The menu items to be displayed in the top bar.
 */
const FixedHeader = (props: Props) => {
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
        <>
            {/* Background */}
            <div className="fixed top-0 left-0 w-screen h-header flex">
                <div className="bg-white h-header" style={{ width: 'calc(50vw - 50px)' }} />
                {/* Center */}
                <div style={{ width: '100px' }}>
                    <Logo className="h-header fill-white" />
                </div>
                <div className="bg-white h-header " style={{ width: 'calc(50vw - 50px)' }} />
            </div>

            <div className="fixed top-0 left-0 w-screen h-header">
                <header className="h-header flex container mx-auto">
                    {/* Left */}
                    <div className="h-header flex" style={{ width: 'calc(50% - 50px)' }}>
                        <Hamburger menu={menu} className="min-md:hidden flex pl-1" /> {/* Mobile */}
                        <Menu className={`max-md:hidden top-bar__menu__container ${scrolled}`} items={menu} />
                    </div>

                    {/* Center */}
                    <Link href="/" style={{ width: '100px' }}>
                        {' '}
                    </Link>

                    {/* Right */}
                    <div className="flex items-center justify-end h-header pr-1" style={{ width: 'calc(50% - 50px)' }}>
                        <Search />

                        <nav className="flex">
                            <a
                                className="w-7 mr-0.5"
                                href="http://twitter.com/sujin2f"
                                rel="noreferrer"
                                target="_blank"
                            >
                                <Twitter className="fill-primary rounded-full" />
                            </a>
                            <a
                                className="w-7 mr-0.5"
                                href="https://www.facebook.com/sujin1977"
                                rel="noreferrer"
                                target="_blank"
                            >
                                <Facebook className="fill-primary rounded-full" />
                            </a>
                        </nav>
                        <Profile />
                    </div>
                </header>
            </div>

            <div className="bg-black w-screen h-header" />
        </>
    )
}

export default FixedHeader
