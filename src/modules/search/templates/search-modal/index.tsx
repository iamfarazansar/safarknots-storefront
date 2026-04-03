"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlassMini, XMarkMini } from "@medusajs/icons"
import { Container, Text } from "@medusajs/ui"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { meiliClient, SEARCH_INDEX_NAME } from "@lib/search-client"

type ProductHit = {
  id: string
  title: string
  handle: string
  description?: string | null
  thumbnail?: string | null
  variant_sku?: string
}

export default function SearchModal() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<ProductHit[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  // Close on click outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (event.target === searchRef.current) {
        router.back()
      }
    }
    window.addEventListener("click", handleOutsideClick)
    return () => window.removeEventListener("click", handleOutsideClick)
  }, [router])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  // Close on Escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        router.back()
      }
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [router])

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    try {
      const searchResults = await meiliClient
        .index(SEARCH_INDEX_NAME)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/results/${query}`)
    }
  }

  return (
    <div className="relative z-[75]">
      <div className="fixed inset-0 bg-opacity-75 backdrop-blur-md opacity-100 h-screen w-screen" />
      <div className="fixed inset-0 px-5 sm:p-0" ref={searchRef}>
        <div className="flex flex-col justify-start w-full h-fit transform p-5 items-center text-left align-middle transition-all max-h-[75vh] bg-transparent shadow-none">
          <div
            className="flex absolute flex-col h-fit w-full sm:w-fit"
            data-testid="search-modal-container"
          >
            <div className="w-full flex items-center gap-x-2 p-4 bg-[rgba(3,7,18,0.5)] text-ui-fg-on-color backdrop-blur-2xl rounded-rounded">
              <MagnifyingGlassMini />
              <form
                onSubmit={handleSubmit}
                className="w-full"
                noValidate
              >
                <div className="flex items-center justify-between">
                  <input
                    ref={inputRef}
                    data-testid="search-input"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    placeholder="Search products..."
                    spellCheck={false}
                    type="search"
                    value={query}
                    onChange={handleInputChange}
                    className="txt-compact-large h-6 placeholder:text-ui-fg-on-color placeholder:transition-colors focus:outline-none flex-1 bg-transparent w-full"
                  />
                  {query && (
                    <button
                      onClick={() => {
                        setQuery("")
                        setResults([])
                        inputRef.current?.focus()
                      }}
                      type="button"
                      className="items-center justify-center text-ui-fg-on-color focus:outline-none gap-x-2 px-2 txt-compact-large flex"
                    >
                      <XMarkMini />
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div className="flex-1 mt-6">
              {query.trim() && (
                <>
                  {isSearching ? (
                    <Container className="flex gap-2 justify-center h-fit py-6">
                      <Text className="text-ui-fg-on-color">Searching...</Text>
                    </Container>
                  ) : results.length === 0 ? (
                    <Container
                      className="flex gap-2 justify-center h-fit py-2"
                      data-testid="no-search-results-container"
                    >
                      <Text className="text-ui-fg-on-color">No results found.</Text>
                    </Container>
                  ) : (
                    <>
                      <div
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 sm:w-[50vw]"
                        data-testid="search-results"
                      >
                        {results.slice(0, 6).map((hit, index) => (
                          <li
                            key={hit.id}
                            className={`list-none ${index > 2 ? "hidden sm:block" : ""}`}
                          >
                            <LocalizedClientLink
                              href={`/products/${hit.handle}`}
                              data-testid="search-result"
                            >
                              <Container
                                className="flex sm:flex-col gap-2 w-full p-4 shadow-elevation-card-rest hover:shadow-elevation-card-hover items-center sm:justify-center"
                              >
                                <Thumbnail
                                  thumbnail={hit.thumbnail}
                                  size="square"
                                  className="group h-12 w-12 sm:h-full sm:w-full"
                                />
                                <div className="flex flex-col justify-between group">
                                  <div className="flex flex-col">
                                    <Text
                                      className="text-ui-fg-subtle"
                                      data-testid="search-result-title"
                                    >
                                      {hit.title}
                                    </Text>
                                  </div>
                                </div>
                              </Container>
                            </LocalizedClientLink>
                          </li>
                        ))}
                      </div>
                      {results.length > 6 && (
                        <Container className="flex sm:flex-col small:flex-row gap-2 justify-center items-center h-fit py-4 small:py-2">
                          <Text className="text-ui-fg-on-color">
                            Showing the first 6 results.
                          </Text>
                          <LocalizedClientLink
                            href={`/results/${query}`}
                            className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                          >
                            View all
                          </LocalizedClientLink>
                        </Container>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
