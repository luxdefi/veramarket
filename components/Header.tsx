import { FC, ReactElement, useEffect, useState } from 'react'
import NavbarLogo from 'components/navbar/NavbarLogo'
import Link from "next/link"
import HamburgerMenu from './HamburgerMenu'
const EXTERNAL_LINKS = process.env.NEXT_PUBLIC_EXTERNAL_LINKS || null

export default function Header() {

    const externalLinks: { name: string; url: string }[] = []



  return (
      <div className="mx-auto grid max-w-[2560px] grid-cols-4 gap-x-4 pb-4 md:grid-cols-8 lg:grid-cols-12 3xl:grid-cols-16 4xl:grid-cols-21">
          <nav className="sticky top-0 z-[1000] col-span-full flex items-center justify-between gap-2 border-b border-[#D4D4D4] bg-white px-6 py-4 dark:border-neutral-600 dark:bg-black md:gap-3 md:py-6 md:px-16">
              <NavbarLogo className="z-10 max-w-[300px]" />
             
              
              
              <HamburgerMenu externalLinks={externalLinks} />
              <div className="z-10 ml-auto hidden shrink-0 md:flex md:gap-2">
                  <Link href='/about' className= " ml-auto w-auto text-black items-center justify-center ">About</Link>
                  <Link href='/contact' className=" ml-auto w-auto text-black items-center justify-center">Contact</Link>
              </div>
          </nav>
     </div>
  )
}
