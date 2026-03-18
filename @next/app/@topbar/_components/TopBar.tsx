'use client'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
/* Components */
import { Menu } from '@app/@topbar/_components/Menu'
// import Hamburger from '@app/@topbar/_components/Hamburger'
import Search from '@app/@topbar/_components/Search'
import { Profile } from '@app/@topbar/_components/Profile'
/* Utils */
import { setMobile } from '@app/_store/slices/menu'
/* T_Types */
import type { RootState } from '@app/_store'
/* Assets */
import Logo from '@app/_lib/images/logo-top-bar.svg'
import Facebook from '@app/_lib/images/icons/facebook.svg'
import Twitter from '@app/_lib/images/icons/twitter.svg'
import HamburgerIcon from '@app/_lib/images/hamburger.svg'
import { useDocumentClick } from '@app/_lib/hooks/useDocumentClick'

type Props = {
    readonly menu: 'primary' | 'ether' | 'ether-kor' | 'dev-tools' | 'recipe' | 'recipe-user' | 'admin'
    readonly showMenu?: boolean
}

/**
 * FixedHeader component that displays a top bar with a menu, logo, and social media links.
 * The top bar changes its appearance when the user scrolls down the page.
 *
 * @param {string} props.menu - The menu items to be displayed in the top bar.
 */
export default function TopBar({ menu, showMenu = false }: Props) {
    // Mobile
    const dispatch = useDispatch()
    const opened = useSelector((state: RootState) => state.menu.mobile)

    const ref = useDocumentClick<HTMLDivElement>(() => {
        if (opened) {
            dispatch(setMobile(false))
        }
    })

    return (
        <header>
            {/* Background */}
            <div className="fixed top-0 left-0 w-screen h-header flex z-45">
                <div className="bg-white h-header" style={{ width: 'calc(50vw - 50px)' }} />
                {/* Center */}
                <h1 style={{ width: '100px' }}>
                    <Logo className="h-header fill-white" alt="Home" />
                </h1>
                <div className="bg-white h-header " style={{ width: 'calc(50vw - 50px)' }} />
            </div>

            <div className="fixed top-0 left-0 w-screen h-header z-50">
                <div className="h-header flex container mx-auto">
                    {/* Left */}
                    <div ref={ref} className="h-header flex" style={{ width: 'calc(50% - 50px)' }}>
                        <button
                            className="min-md:hidden flex pl-1 w-12 cursor-pointer"
                            onClick={() => dispatch(setMobile(!opened))}
                            type="button"
                        >
                            <HamburgerIcon className="fill-primary" />
                        </button>
                        <Menu position={menu} id="top-bar" showMenu={showMenu} />
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
                </div>
            </div>

            <div className="bg-black w-screen h-header" />
        </header>
    )
}
