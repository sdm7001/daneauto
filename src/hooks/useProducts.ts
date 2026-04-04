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

export interface ProductFilters {
  year?: string
  make?: string
  model?: string
  productLine?: string
  search?: string
  page?: number
  pageSize?: number
}

export interface ProductsResult {
  products: Product[]
  total: number
}

export function useProducts(filters: ProductFilters = {}) {
  const { year, make, model, productLine, search, page = 1, pageSize = 24 } = filters
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const hasFilter = !!(year || make || model || productLine || search)

  return useQuery<ProductsResult>({
    queryKey: ['products', { year, make, model, productLine, search, page, pageSize }],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('sku')

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
      const { data, error } = await supabase
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
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .not('image_url', 'is', null)
        .gte('net_price', 10)
        .order('id', { ascending: false })
        .limit(limit)
      if (error) throw error
      return (data as Product[]) ?? []
    },
    staleTime: 5 * 60 * 1000,
  })
}
