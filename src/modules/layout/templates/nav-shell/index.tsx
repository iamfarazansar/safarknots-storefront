"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import AnnouncementBanner from "@modules/layout/components/announcement-banner"

type Props = {
  children: React.ReactNode
}

export default function NavShell({ children }: Props) {
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  const updateNavbar = useCallback(() => {
    const y = window.scrollY

    if (y > lastScrollY.current && y > 10) {
      setVisible(false)
    } else if (y < lastScrollY.current) {
      setVisible(true)
    }

    lastScrollY.current = y
    ticking.current = false
  }, [])

  const onScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(updateNavbar)
      ticking.current = true
    }
  }, [updateNavbar])

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [onScroll])

  useEffect(() => {
    const showNav = () => setVisible(true)
    window.addEventListener("show-nav", showNav)
    return () => window.removeEventListener("show-nav", showNav)
  }, [])

  return (
    <>
      {/* Spacer: banner (36px) + nav (78px mobile / 94px desktop) */}
      <div className="h-[114px] tablet:h-[130px]" />

      <header
        className={`w-full fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <AnnouncementBanner />

        <div className="w-full h-[78px] tablet:h-[94px] bg-[#EEE6DD] flex items-center justify-between border-b border-[#D8CDC0] shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          {children}
        </div>
      </header>
    </>
  )
}
