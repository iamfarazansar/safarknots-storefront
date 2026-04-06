"use client"

import { useState, useCallback, useEffect, useRef } from "react"

const announcements = [
  "Get in touch with our sales agent +91 8457923610",
  "Get 10% off on First Order | Use Code: SAFAR10",
  "Free Shipping on Orders Above $199",
]

export default function AnnouncementBanner() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length)
    }, 4000)
  }, [])

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startTimer])

  const go = (dir: -1 | 1) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setCurrent((prev) => (prev + dir + announcements.length) % announcements.length)
    startTimer()
  }

  return (
    <div className="w-full h-[36px] bg-[#D6C8B8] text-[#5A463A]">
      <div className="max-w-xl mx-auto flex items-center justify-between px-4 h-full">
        <button
          onClick={() => go(-1)}
          className="shrink-0 w-8 h-8 flex items-center justify-center text-[#5A463A]/50 hover:text-[#3F2F26] transition"
          aria-label="Previous announcement"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <p className="flex-1 text-center text-[12px] sm:text-[13px] tracking-wide py-2.5 transition-opacity duration-300">
          {announcements[current]}
        </p>

        <button
          onClick={() => go(1)}
          className="shrink-0 w-8 h-8 flex items-center justify-center text-[#5A463A]/50 hover:text-[#3F2F26] transition"
          aria-label="Next announcement"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  )
}
