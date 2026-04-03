"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { Meilisearch } from "meilisearch"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { BsSearch, BsX } from "react-icons/bs"
import Thumbnail from "@modules/products/components/thumbnail"

const SEARCH_ENDPOINT =
  process.env.NEXT_PUBLIC_SEARCH_ENDPOINT || "http://localhost:7700"
const SEARCH_API_KEY = process.env.NEXT_PUBLIC_SEARCH_API_KEY || ""

type ProductHit = {
  id: string
  title: string
  handle: string
  description?: string
  thumbnail?: string
  variant_sku?: string
}

export default function SearchBar({ children }: { children?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ProductHit[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const inputRefMobile = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mobileContainerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Focus input when search opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150)
      setTimeout(() => inputRefMobile.current?.focus(), 100)
    }
  }, [isOpen])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        mobileContainerRef.current &&
        !mobileContainerRef.current.contains(target)
      ) {
        closeSearch()
      }
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        !mobileContainerRef.current
      ) {
        closeSearch()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }
    setIsSearching(true)
    try {
      const client = new Meilisearch({
        host: SEARCH_ENDPOINT,
        apiKey: SEARCH_API_KEY,
      })
      const searchResults = await client
        .index("products")
        .search(searchQuery, { limit: 8 })
      setResults(searchResults.hits as ProductHit[])
    } catch (err) {
      console.error("Search error:", err)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => performSearch(value), 250)
  }

  const closeSearch = () => {
    setIsOpen(false)
    setQuery("")
    setResults([])
  }

  const renderResults = () => {
    if (!query.trim()) return null
    return (
      <>
        {isSearching ? (
          <div className="px-4 py-6 text-center text-gray-400 text-sm">
            Searching...
          </div>
        ) : results.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-400 text-sm">
            No results for &ldquo;{query}&rdquo;
          </div>
        ) : (
          <div className="max-h-[60vh] md:max-h-[400px] overflow-y-auto">
            {results.map((product, i) => (
              <LocalizedClientLink
                key={product.id}
                href={`/products/${product.handle}`}
                onClick={closeSearch}
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition ${
                  i > 0 ? "border-t border-gray-100" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {product.thumbnail ? (
                    <Thumbnail
                      thumbnail={product.thumbnail}
                      size="square"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                      No img
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-800 line-clamp-2">
                  {product.title}
                </span>
              </LocalizedClientLink>
            ))}
          </div>
        )}
      </>
    )
  }

  return (
    <>
      {/* ========== DESKTOP: inline search replacing nav links ========== */}
      <div ref={containerRef} className="relative items-center hidden tablet:flex flex-1 justify-end gap-5 medium:gap-8 large:gap-10">
        {/* When search is closed, show nav links (children) */}
        {!isOpen && children}

        {/* When search is open, show inline input in place of nav links */}
        {isOpen && (
          <div
            className="flex items-center border border-gray-300 rounded-full overflow-hidden flex-1 max-w-[380px]"
            style={{
              animation: "searchExpandInline 0.25s ease-out forwards",
            }}
          >
            <div className="flex-shrink-0 w-10 h-10 flex justify-center items-center">
              <BsSearch className="text-[15px] text-gray-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={handleInputChange}
              className="bg-transparent outline-none text-sm flex-1 pr-2"
            />
            <button
              onClick={closeSearch}
              className="flex-shrink-0 w-10 h-10 flex justify-center items-center text-gray-400 hover:text-black transition"
              aria-label="Close search"
            >
              <BsX className="text-xl" />
            </button>
          </div>
        )}

        {/* Search icon — always visible */}
        <button
          onClick={() => {
            if (isOpen) closeSearch()
            else setIsOpen(true)
          }}
          className="w-10 h-10 rounded-full flex justify-center items-center cursor-pointer hover:bg-black/[0.05] transition shrink-0"
          aria-label="Search"
        >
          <BsSearch className="text-[18px] text-gray-600" />
        </button>

        {/* Desktop results dropdown */}
        {isOpen && query.trim() && (
          <div className="absolute top-full right-10 mt-2 w-[400px] bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-[100]">
            {renderResults()}
          </div>
        )}
      </div>

      {/* Desktop inline animation */}
      <style jsx global>{`
        @keyframes searchExpandInline {
          from { opacity: 0; max-width: 40px; }
          to { opacity: 1; max-width: 380px; }
        }
      `}</style>

      {/* ========== MOBILE ========== */}
      <style jsx global>{`
        @keyframes searchGrowIn {
          0% { opacity: 0; transform: scaleX(0.3) scaleY(0.8); }
          60% { opacity: 1; transform: scaleX(1.02) scaleY(1); }
          100% { opacity: 1; transform: scaleX(1) scaleY(1); }
        }
        @keyframes searchFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes searchDropIn {
          0% { opacity: 0; transform: translateY(-8px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Mobile search icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="tablet:hidden w-8 h-8 rounded-full flex justify-center items-center hover:bg-black/[0.05] cursor-pointer transition"
          aria-label="Search"
        >
          <BsSearch className="text-[15px] text-black" />
        </button>
      )}

      {/* Mobile overlay */}
      {isOpen && (
        <div
          ref={mobileContainerRef}
          className="fixed inset-x-0 top-0 z-[200] tablet:hidden"
        >
          <div
            className="flex items-center gap-2 bg-[#FAF7F2] px-4 h-[76px] shadow-md border-b border-gray-200"
            style={{
              animation: "searchFadeIn 0.2s ease-out forwards",
            }}
          >
            <div className="flex items-center flex-1 bg-gray-100 rounded-full border border-gray-200">
              <div className="flex-shrink-0 w-10 h-10 flex justify-center items-center">
                <BsSearch className="text-[15px] text-gray-400" />
              </div>
              <input
                ref={inputRefMobile}
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={handleInputChange}
                className="bg-transparent outline-none text-base flex-1 pr-2"
              />
              <button
                onClick={closeSearch}
                className="flex-shrink-0 w-10 h-10 flex justify-center items-center text-gray-400 hover:text-black transition"
                aria-label="Close search"
              >
                <BsX className="text-xl" />
              </button>
            </div>
          </div>

          {/* Mobile results dropdown */}
          {query.trim() && (
            <div
              className="mx-4 mt-2 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden"
              style={{ animation: "searchDropIn 0.25s ease-out forwards" }}
            >
              {renderResults()}
            </div>
          )}

          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black/20 -z-10"
            style={{ animation: "searchFadeIn 0.3s ease-out forwards" }}
            onClick={closeSearch}
          />
        </div>
      )}
    </>
  )
}
