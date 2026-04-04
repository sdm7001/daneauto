import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export function useWishlist() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: wishlistSkus = [], isLoading } = useQuery<string[]>({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await (supabase as any)
        .from('wishlist')
        .select('product_sku')
        .eq('user_id', user.id)
      if (error) throw error
      return (data as { product_sku: string }[]).map(r => r.product_sku)
    },
    enabled: !!user,
    staleTime: 60 * 1000,
  })

  const isInWishlist = (sku: string) => wishlistSkus.includes(sku)

  const addMutation = useMutation({
    mutationFn: async (sku: string) => {
      if (!user) throw new Error('Not logged in')
      const { error } = await (supabase as any)
        .from('wishlist')
        .insert({ user_id: user.id, product_sku: sku })
      if (error) throw error
    },
    onMutate: async (sku) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist', user?.id] })
      const prev = queryClient.getQueryData<string[]>(['wishlist', user?.id])
      queryClient.setQueryData(['wishlist', user?.id], [...(prev ?? []), sku])
      return { prev }
    },
    onError: (_err, _sku, context) => {
      queryClient.setQueryData(['wishlist', user?.id], context?.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] })
    },
  })

  const removeMutation = useMutation({
    mutationFn: async (sku: string) => {
      if (!user) throw new Error('Not logged in')
      const { error } = await (supabase as any)
        .from('wishlist')
        .delete()
        .eq('user_id', user.id)
        .eq('product_sku', sku)
      if (error) throw error
    },
    onMutate: async (sku) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist', user?.id] })
      const prev = queryClient.getQueryData<string[]>(['wishlist', user?.id])
      queryClient.setQueryData(['wishlist', user?.id], (prev ?? []).filter(s => s !== sku))
      return { prev }
    },
    onError: (_err, _sku, context) => {
      queryClient.setQueryData(['wishlist', user?.id], context?.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] })
    },
  })

  const toggle = (sku: string) => {
    if (isInWishlist(sku)) {
      removeMutation.mutate(sku)
    } else {
      addMutation.mutate(sku)
    }
  }

  return { wishlistSkus, isLoading, isInWishlist, toggle, count: wishlistSkus.length }
}
