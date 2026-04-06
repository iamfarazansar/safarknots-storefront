"use client"

import React, { useMemo, useState, useRef, useEffect } from "react"
import { BsChevronDown, BsChevronRight } from "react-icons/bs"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Category = {
  id: string
  name: string
  handle: string
  parent_category?: any
  category_children?: Category[]
}

type NavItem = { id: number; name: string; url: string }

export default function MenuMobile({
  setMobileMenu,
  categories,
  toggleButtonRef,
  isOpen,
}: {
  setMobileMenu: (value: boolean) => void
  categories: Category[]
  toggleButtonRef?: React.RefObject<HTMLButtonElement | null>
  isOpen: boolean
}) {
  const [showCatMenu, setShowCatMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when tapping anywhere outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node

      if (toggleButtonRef?.current?.contains(target)) {
        return
      }

      if (menuRef.current && !menuRef.current.contains(target)) {
        setMobileMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [isOpen, setMobileMenu, toggleButtonRef])

  const topLevelCats = useMemo(
    () => (categories || []).filter((c) => !c.parent_category),
    [categories]
  )

  const links: NavItem[] = [
    { id: 1, name: "Shop", url: "/store" },
    { id: 2, name: "Collections", url: "/collections" },
    { id: 3, name: "Custom Rugs", url: "/custom-rugs" },
    { id: 4, name: "Heritage Rugs", url: "/heritage-rugs" },
    { id: 5, name: "About", url: "/about" },
    { id: 6, name: "Journal", url: "/journal" },
    { id: 7, name: "Contact", url: "/contact" },
    { id: 8, name: "Account", url: "/account" },
  ]

  return (
    <div
      className={`fixed left-0 right-0 top-[78px] w-screen z-[9999] tablet:hidden grid transition-all duration-300 ease-out ${
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="overflow-hidden">
        <ul className="max-h-[calc(100vh-78px)] overflow-y-auto text-black font-bold">
          <li className="px-5 py-4">
            <div
              ref={menuRef}
              className="rounded-2xl bg-gray-50 shadow-[0_4px_20px_rgba(0,0,0,0.12)] overflow-hidden"
            >
              {/* Navigation links */}
              {links.map((item, index) => (
                <div key={item.id} onClick={() => setMobileMenu(false)}>
                  <LocalizedClientLink href={item.url}>
                    <div
                      className={`py-4 px-5 cursor-pointer hover:bg-gray-100 bg-white ${
                        index > 0 ? "border-t border-gray-200" : ""
                      }`}
                    >
                      {item.name}
                    </div>
                  </LocalizedClientLink>
                </div>
              ))}

              {/* Categories accordion */}
              <div
                className="flex justify-between items-center py-4 px-5 cursor-pointer border-t border-gray-200 bg-white hover:bg-gray-100"
                onClick={() => setShowCatMenu((v) => !v)}
              >
                <span>Categories</span>
                <BsChevronDown
                  size={14}
                  className={
                    showCatMenu
                      ? "rotate-180 transition-transform duration-200"
                      : "transition-transform duration-200"
                  }
                />
              </div>

              {/* Category items with slide transition */}
              <div
                className={`grid transition-all duration-300 ease-out ${
                  showCatMenu ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div
                  className="overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {topLevelCats.map((cat) => (
                    <LocalizedClientLink
                      key={cat.id}
                      href={`/categories/${cat.handle}`}
                      className="flex items-center justify-between py-3 px-5 border-t border-gray-200 bg-white hover:bg-gray-100"
                      onClick={() => setMobileMenu(false)}
                    >
                      <span className="text-base font-semibold">
                        {cat.name}
                      </span>
                      <BsChevronRight size={14} className="text-gray-400" />
                    </LocalizedClientLink>
                  ))}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}
