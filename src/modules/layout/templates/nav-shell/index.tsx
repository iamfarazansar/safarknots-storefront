"use client"

import { useEffect, useState, useRef, useCallback } from "react"

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
      {/* Spacer to prevent content from going under fixed nav */}
      <div className="h-[76px] tablet:h-[90px]" />

      <header
        className={`w-full h-[76px] tablet:h-[90px] bg-[#FAF7F2] flex items-center justify-between z-50 fixed top-0 left-0 right-0 transition-transform duration-300 border-b border-gray-200/60 ${
          visible ? "translate-y-0 shadow-[0_1px_8px_rgba(0,0,0,0.04)]" : "-translate-y-full"
        }`}
      >
        {children}
      </header>
    </>
  )
}
