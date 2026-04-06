import { Suspense } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import Link from "next/link"
import Image from "next/image"
import NavShell from "../nav-shell"
import { BsPerson, BsHeart } from "react-icons/bs"
import SearchBar from "@modules/layout/components/search-bar"
import { listCategories } from "@lib/data/categories"
import NavMobile from "../nav-mobile"

export default async function Nav() {
  const productCategories = await listCategories()

  const NAV_LINKS_LEFT = [
    { name: "Shop", href: "/store" },
    { name: "Collections", href: "/collections" },
    { name: "Custom Rugs", href: "/custom-rugs" },
    { name: "Heritage Rugs", href: "/heritage-rugs" },
  ]

  const NAV_LINKS_RIGHT = [
    { name: "About", href: "/about" },
    { name: "Journal", href: "/journal" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <NavShell>
      {/* ========== DESKTOP NAV (≥768px) ========== */}
      <div className="hidden tablet:flex max-w-[1440px] w-full mx-auto h-full items-center justify-between px-8">
        {/* LEFT NAV LINKS */}
        <div
          className="flex items-center gap-7 flex-1"
        >
          {NAV_LINKS_LEFT.map((link) => (
            <LocalizedClientLink
              key={link.name}
              href={link.href}
              className="text-[12px] medium:text-[13px] font-medium text-[#5A463A] hover:text-[#3F2F26] transition-colors duration-200 whitespace-nowrap tracking-wide uppercase"
            >
              {link.name}
            </LocalizedClientLink>
          ))}
        </div>

        {/* CENTER: Logo */}
        <div className="flex items-center justify-center shrink-0 mx-8">
          <Link href="/" className="block">
            <Image
              src="/logo_safar.png"
              alt="SafarKnots - Every Day Deserves a Luxury"
              width={789}
              height={464}
              className="w-auto h-[75px] object-contain"
              priority
            />
          </Link>
        </div>

        {/* RIGHT NAV LINKS + SEARCH + ICONS */}
        <div className="flex items-center gap-7 flex-1 justify-end">
          {/* Right links — hidden via CSS when search is open */}
          <div data-nav-right-links className="flex items-center gap-7">
            {NAV_LINKS_RIGHT.map((link) => (
              <LocalizedClientLink
                key={link.name}
                href={link.href}
                className="text-[12px] medium:text-[13px] font-medium text-[#5A463A] hover:text-[#3F2F26] transition-colors duration-200 whitespace-nowrap tracking-wide uppercase"
              >
                {link.name}
              </LocalizedClientLink>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <SearchBar />

            <LocalizedClientLink
              className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-[#D8CDC0]/40 cursor-pointer transition-colors duration-200"
              href="/account"
              data-testid="nav-account-link"
            >
              <BsPerson className="text-[22px] text-[#5A463A]" />
            </LocalizedClientLink>

            <LocalizedClientLink
              className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-[#D8CDC0]/40 cursor-pointer transition-colors duration-200"
              href="/wishlist"
            >
              <BsHeart className="text-[17px] text-[#5A463A]" />
            </LocalizedClientLink>

            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </div>
      </div>

      {/* ========== MOBILE NAV (<tablet) ========== */}
      <div className="grid tablet:hidden grid-cols-3 h-full items-center px-5 w-full">
        {/* LEFT: Hamburger */}
        <div className="flex items-center justify-start">
          <NavMobile categories={productCategories} />
        </div>

        {/* CENTER: Logo */}
        <div className="flex items-center justify-center">
          <Link href="/" className="block">
            <Image
              src="/logo_safar.png"
              alt="SafarKnots"
              width={789}
              height={464}
              className="w-auto h-[56px] object-contain"
              priority
            />
          </Link>
        </div>

        {/* RIGHT: Search + Cart */}
        <div className="flex items-center justify-end gap-1">
          <SearchBar />

          <Suspense
            fallback={
              <LocalizedClientLink
                className="hover:text-ui-fg-base flex gap-2"
                href="/cart"
                data-testid="nav-cart-link"
              >
                Cart (0)
              </LocalizedClientLink>
            }
          >
            <CartButton />
          </Suspense>
        </div>
      </div>
    </NavShell>
  )
}
