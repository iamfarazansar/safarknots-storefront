"use server"

import { meiliClient, SEARCH_INDEX_NAME } from "@lib/search-client"

export type ProductHit = {
  id: string
  title: string
  handle: string
  description?: string | null
  thumbnail?: string | null
  variant_sku?: string
}

export async function search(query: string): Promise<ProductHit[]> {
  if (!query.trim()) return []

  try {
    const results = await meiliClient
      .index(SEARCH_INDEX_NAME)
      .search(query, { limit: 20 })
    return results.hits as ProductHit[]
  } catch (err) {
    console.error("Search error:", err)
    return []
  }
}
