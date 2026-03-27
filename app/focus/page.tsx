import Image from 'next/image'
import { Button } from '@app/_components/html-elements/Button'

import Logo from '@app/_lib/images/focus/icon.png'
import Screen01 from '@app/_lib/images/focus/screen01.png'
import Screen02 from '@app/_lib/images/focus/screen02.png'
import Win from '@app/_lib/images/icons/win.png'
import Mac from '@app/_lib/images/icons/mac.png'
import Linux from '@app/_lib/images/icons/linux.png'

export default async function Focus() {
    return (
        <main className="container mx-auto my-15 flex flex-col justify-center">
            <div className="flex justify-center mb-3 mt-4">
                <Image src={Logo} width={140} height={140} alt="Focus" />
                <h2 className="ml-5 text-8xl font-extrabold text-slate-700">Focus</h2>
            </div>

            <p className="text-center text-3xl font-extrabold text-slate-600 mb-5">
                Simple, Fast Web Browser without Tab
            </p>

            <Button
                className="mx-auto mb-5"
                dom="a"
                href="https://github.com/sujin2f/focus-browser/releases"
                target="_blank"
            >
                Download
            </Button>

            <div className="grid md:grid-cols-2">
                <Image src={Screen01} width={800} alt="Focus" />
                <Image src={Screen02} width={800} alt="Focus" />
            </div>

            <div className="flex justify-center gap-2">
                <Image src={Win} width={50} alt="Focus" />
                <Image src={Mac} width={50} alt="Focus" />
                <Image src={Linux} width={50} alt="Focus" />
            </div>
        </main>
    )
}
