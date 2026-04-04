import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface Product {
  id: number
  sku: string
  description: string | null
  list_price: number | null
  net_price: number | null
  oem_number: string | null
  partslink_number: string | null
  image_url: string | null
  certification: string | null
  year: string
  make: string
  model: string
  product_line: string
  scraped_at: string | null
}

export type ProductSort = 'sku' | 'price_asc' | 'price_desc' | 'newest'

export interface ProductFilters {
  year?: string
  make?: string
  model?: string
  productLine?: string
  subcategory?: string
  search?: string
  sort?: ProductSort
  page?: number
  pageSize?: number
}

export interface ProductsResult {
  products: Product[]
  total: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any

export function useProducts(filters: ProductFilters = {}) {
  const { year, make, model, productLine, subcategory, search, sort = 'sku', page = 1, pageSize = 24 } = filters
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const hasFilter = !!(year || make || model || productLine || subcategory || search)

  return useQuery<ProductsResult>({
    queryKey: ['products', { year, make, model, productLine, subcategory, search, sort, page, pageSize }],
    queryFn: async () => {
      let query = db
        .from('products')
        .select('*', { count: 'exact' })
        .range(from, to)

      if (sort === 'price_asc')  query = query.order('list_price', { ascending: true,  nullsFirst: false })
      else if (sort === 'price_desc') query = query.order('list_price', { ascending: false, nullsFirst: false })
      else if (sort === 'newest') query = query.order('id', { ascending: false })
      else query = query.order('sku')

      if (year)        query = query.eq('year', year)
      if (make)        query = query.eq('make', make)
      if (model)       query = query.eq('model', model)
      if (productLine) query = query.eq('product_line', productLine)
      if (search) {
        query = query.or(
          `description.ilike.%${search}%,sku.ilike.%${search}%,oem_number.ilike.%${search}%,partslink_number.ilike.%${search}%`
        )
      }

      const { data, error, count } = await query
      if (error) throw error
      return { products: (data as Product[]) ?? [], total: count ?? 0 }
    },
    enabled: hasFilter,
    placeholderData: prev => prev,
  })
}

export function useProduct(sku: string) {
  return useQuery<Product | null>({
    queryKey: ['product', sku],
    queryFn: async () => {
      const { data, error } = await db
        .from('products')
        .select('*')
        .eq('sku', sku)
        .limit(1)
        .single()
      if (error) throw error
      return data as Product
    },
    enabled: !!sku,
  })
}

export function useFeaturedProducts(limit = 8) {
  return useQuery<Product[]>({
    queryKey: ['products', 'featured', limit],
    queryFn: async () => {
      const { data, error } = await db
        .from('products')
        .select('*')
        .not('image_url', 'is', null)
        .not('list_price', 'is', null)
        .order('id', { ascending: false })
        .limit(limit)
      if (error) throw error
      return (data as Product[]) ?? []
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useRelatedProducts(product: Product | null | undefined, limit = 8) {
  return useQuery<Product[]>({
    queryKey: ['products', 'related', product?.sku, limit],
    queryFn: async () => {
      if (!product) return []
      const { data, error } = await db
        .from('products')
        .select('*')
        .eq('product_line', product.product_line)
        .eq('year', product.year)
        .eq('make', product.make)
        .eq('model', product.model)
        .neq('sku', product.sku)
        .limit(limit)
      if (error) throw error
      return (data as Product[]) ?? []
    },
    enabled: !!product,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCompatibleVehicles(partslink: string | null | undefined) {
  return useQuery<Pick<Product, 'year' | 'make' | 'model'>[]>({
    queryKey: ['products', 'compatibility', partslink],
    queryFn: async () => {
      if (!partslink) return []
      const { data, error } = await db
        .from('products')
        .select('year, make, model')
        .eq('partslink_number', partslink)
        .order('year', { ascending: false })
        .limit(50)
      if (error) throw error
      // Deduplicate
      const seen = new Set<string>()
      return (data as Pick<Product, 'year' | 'make' | 'model'>[]).filter(v => {
        const key = `${v.year}-${v.make}-${v.model}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
    },
    enabled: !!partslink,
    staleTime: 5 * 60 * 1000,
  })
}
