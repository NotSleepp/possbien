import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/api';
import { useAuthStore } from '../../../store/useAuthStore';
import { createProduct as createProductApi, updateProduct as updateProductApi } from '../api/products.api';

/**
 * Custom hook for managing products data
 */
export const useProducts = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const idEmpresa = user?.id_empresa;

  console.log('[useProducts] INIT', { idEmpresa, userExists: !!user });

  // Fetch all products for the user's company
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products', idEmpresa],
    queryFn: async () => {
      console.log('[useProducts] queryFn START', { idEmpresa });
      if (!idEmpresa) {
        console.error('[useProducts] queryFn ERROR: idEmpresa missing');
        throw new Error('No se encontró la empresa del usuario');
      }
      const url = `/productos/por-empresa/${idEmpresa}`;
      console.log('[useProducts] GET', url);
      const response = await api.get(url);
      const items = response.data || [];
      console.log('[useProducts] queryFn SUCCESS', { count: Array.isArray(items) ? items.length : 'n/a' });
      if (Array.isArray(items) && items.length > 0) {
        console.log('[useProducts] First item keys:', Object.keys(items[0] || {}));
      }
      return items;
    },
    enabled: !!idEmpresa,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId) => {
      console.log('[useProducts] DELETE mutation START', { productId });
      const url = `/productos/${productId}`;
      const res = await api.delete(url);
      console.log('[useProducts] DELETE mutation SUCCESS', { status: res.status });
    },
    onSuccess: () => {
      console.log('[useProducts] DELETE onSuccess -> invalidating products');
      queryClient.invalidateQueries(['products', idEmpresa]);
    },
    onError: (err) => {
      console.error('[useProducts] DELETE onError', err);
    },
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (payload) => {
      console.log('[useProducts] CREATE mutation START', { payload });
      const res = await createProductApi(payload);
      console.log('[useProducts] CREATE mutation SUCCESS', { res });
      return res;
    },
    onSuccess: () => {
      console.log('[useProducts] CREATE onSuccess -> invalidating products');
      queryClient.invalidateQueries(['products', idEmpresa]);
    },
    onError: (err) => {
      console.error('[useProducts] CREATE onError', err);
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      console.log('[useProducts] UPDATE mutation START', { id, payload });
      const res = await updateProductApi(id, payload);
      console.log('[useProducts] UPDATE mutation SUCCESS', { res });
      return res;
    },
    onSuccess: () => {
      console.log('[useProducts] UPDATE onSuccess -> invalidating products');
      queryClient.invalidateQueries(['products', idEmpresa]);
    },
    onError: (err) => {
      console.error('[useProducts] UPDATE onError', err);
    },
  });

  return {
    products,
    isLoading,
    isError,
    error,
    refetch,
    deleteProduct: deleteProductMutation.mutate,
    isDeleting: deleteProductMutation.isPending,
    createProduct: createProductMutation.mutate,
    isCreating: createProductMutation.isPending,
    updateProduct: updateProductMutation.mutate,
    isUpdating: updateProductMutation.isPending,
  };
};