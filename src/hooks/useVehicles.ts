import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export function useVehicleYears() {
  return useQuery<string[]>({
    queryKey: ['vehicles', 'years'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_vehicle_years')
      if (error) throw error
      return (data as { year: string }[]).map(r => r.year)
    },
    staleTime: Infinity,
  })
}

export function useVehicleMakes(year: string) {
  return useQuery<string[]>({
    queryKey: ['vehicles', 'makes', year],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_vehicle_makes', { p_year: year })
      if (error) throw error
      return (data as { make: string }[]).map(r => r.make)
    },
    enabled: !!year,
    staleTime: Infinity,
  })
}

export function useVehicleModels(year: string, make: string) {
  return useQuery<string[]>({
    queryKey: ['vehicles', 'models', year, make],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_vehicle_models', {
        p_year: year,
        p_make: make,
      })
      if (error) throw error
      return (data as { model: string }[]).map(r => r.model)
    },
    enabled: !!year && !!make,
    staleTime: Infinity,
  })
}

export interface ProductLineCount {
  product_line: string
  count: number
  sample_image?: string | null
}

export function useTopProductLines(limit = 16) {
  return useQuery<ProductLineCount[]>({
    queryKey: ['vehicles', 'top-lines', limit],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_top_product_lines', { p_limit: limit })
      if (error) throw error
      return (data as ProductLineCount[]) ?? []
    },
    staleTime: Infinity,
  })
}

export function useVehicleProductLines(year: string, make: string, model: string, limit = 8) {
  return useQuery<ProductLineCount[]>({
    queryKey: ['vehicles', 'vehicle-lines', year, make, model, limit],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_vehicle_product_lines', {
        p_year: year,
        p_make: make,
        p_model: model,
        p_limit: limit,
      } as any)
      if (error) throw error
      return (data as ProductLineCount[]) ?? []
    },
    enabled: !!year && !!make && !!model,
    staleTime: Infinity,
  })
}

export function useProductLines(year: string, make: string, model: string) {
  return useQuery<string[]>({
    queryKey: ['vehicles', 'lines', year, make, model],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_product_lines', {
        p_year: year,
        p_make: make,
        p_model: model,
      })
      if (error) throw error
      return (data as { product_line: string }[]).map(r => r.product_line)
    },
    enabled: !!year && !!make && !!model,
    staleTime: Infinity,
  })
}

export interface SubcategoryCount {
  subcategory: string
  count: number
}

export function useSubcategories(year?: string, make?: string, model?: string, category?: string) {
  return useQuery<SubcategoryCount[]>({
    queryKey: ['vehicles', 'subcategories', year, make, model, category],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc('get_subcategories', {
        p_year: year || null,
        p_make: make || null,
        p_model: model || null,
        p_category: category || null,
      })
      if (error) throw error
      return (data as SubcategoryCount[]) ?? []
    },
    staleTime: Infinity,
  })
}
