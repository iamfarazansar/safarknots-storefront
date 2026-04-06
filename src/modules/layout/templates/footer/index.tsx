import Link from "next/link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Wrapper from "../wrapper"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import CountrySelectFooterNav from "@modules/layout/components/country-select-footer-nav"
import FooterSocialIcons from "@modules/layout/components/footer-social-icons"

export default async function Footer() {
  const regions = await listRegions().then((regions: StoreRegion[]) => regions)
  return (
    <footer className="bg-[#b4a794] text-[#2f2723] pt-8 lg:pt-14 pb-3">
      <Wrapper className="flex justify-between flex-col md:flex-row gap-[50px] md:gap-0 md:flex-wrap">
        {/* LEFT START */}
        <div className="flex gap-[50px] md:gap-[75px] lg:gap-[100px] flex-col md:flex-row">
          {/* MENU START */}
          <div className="flex flex-col gap-3 shrink-0">
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLScy8V3hSE3u9VKusz6ZXzXVgjJgLxGb50Rb2r2ILrYLVHK5ig/viewform?usp=sf_link"
              target="_blank"
            >
              <div className="font-oswald font-medium uppercase text-sm cursor-pointer">
                become a partner
              </div>
            </Link>
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLSdpIE3WIRG9FSZ3AYUFKSU5IymBCL36thacXBsX50BNtt5k4A/viewform?usp=sf_link"
              target="_blank"
            >
              <div className="font-oswald font-medium uppercase text-sm cursor-pointer">
                send us feedback
              </div>
            </Link>
          </div>
          {/* MENU END */}

          {/* NORMAL MENU START */}
          <div className="flex gap-[50px] md:gap-[75px] lg:gap-[100px] shrink-0">
            {/* MENU START */}
            <div className="flex flex-col gap-3">
              <div className="font-oswald font-medium uppercase text-sm">
                get help
              </div>
              <LocalizedClientLink href="/payment-options">
                <div className="text-sm text-[#2f2723]/60 hover:text-[#2f2723] cursor-pointer">
                  Payment Options
                </div>
              </LocalizedClientLink>
              <LocalizedClientLink href="/contact-us">
                <div className="text-sm text-[#2f2723]/60 hover:text-[#2f2723] cursor-pointer">
                  Contact Us
                </div>
              </LocalizedClientLink>
            </div>
            {/* MENU END */}

            {/* MENU START */}
            <div className="flex flex-col gap-3">
              <div className="font-oswald font-medium uppercase text-sm">
                About SafarKnots
              </div>

              <LocalizedClientLink href="/about-us">
                <div className="text-sm text-[#2f2723]/60 hover:text-[#2f2723] cursor-pointer">
                  About Us
                </div>
              </LocalizedClientLink>
              <LocalizedClientLink href="/sustainability">
                <div className="text-sm text-[#2f2723]/60 hover:text-[#2f2723] cursor-pointer">
                  Sustainability
                </div>
              </LocalizedClientLink>
            </div>
            {/* MENU END */}
          </div>
          {/* NORMAL MENU END */}
        </div>
        {/* LEFT END */}

        {/* RIGHT START */}
        <FooterSocialIcons />
        {/* RIGHT END */}
      </Wrapper>

      {/* BOTTOM SECTION */}
      <Wrapper className="mt-10 mb-[env(safe-area-inset-bottom)]">
        {/* Copyright + Policies + Country */}
        <div className="flex justify-between items-center flex-col md:flex-row gap-4 md:gap-0 pt-2 md:pt-2 pb-4 md:pb-0 border-t border-[#2f2723]/15">
          {/* Country Selector - mobile only */}
          <div className="flex justify-center md:hidden w-full pt-4">
            <CountrySelectFooterNav regions={regions} />
          </div>

          <div className="flex gap-2 md:gap-5 text-center md:text-left flex-wrap justify-center">
            <LocalizedClientLink href="/terms-of-service">
              <div className="text-[12px] text-[#2f2723]/50 hover:text-[#2f2723] cursor-pointer">
                Terms of Service
              </div>
            </LocalizedClientLink>
            <LocalizedClientLink href="/privacy-policy">
              <div className="text-[12px] text-[#2f2723]/50 hover:text-[#2f2723] cursor-pointer">
                Privacy Policy
              </div>
            </LocalizedClientLink>
            <LocalizedClientLink href="/cancellation-refund-policy">
              <div className="text-[12px] text-[#2f2723]/50 hover:text-[#2f2723] cursor-pointer">
                Cancellation & Refund Policy
              </div>
            </LocalizedClientLink>
            <LocalizedClientLink href="/shipping-return-policy">
              <div className="text-[12px] text-[#2f2723]/50 hover:text-[#2f2723] cursor-pointer">
                Shipping & Return Policy
              </div>
            </LocalizedClientLink>
          </div>

          {/* Country Selector - desktop only */}
          <div className="hidden md:flex justify-end">
            <CountrySelectFooterNav regions={regions} />
          </div>
        </div>

        {/* Copyright */}
        <div className="text-[12px] text-[#2f2723]/50 text-center pt-4 pb-2">
          © {new Date().getFullYear()} SafarKnots, All Rights Reserved
        </div>
      </Wrapper>
    </footer>
  )
}
