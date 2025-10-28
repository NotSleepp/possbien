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
      if (!idEmpresa) {
        throw new Error('No se encontró la empresa del usuario');
      }
      const response = await api.get(`/productos/por-empresa/${idEmpresa}`);
      return response.data;
    },
    enabled: !!idEmpresa,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (productId) => {
      await api.delete(`/productos/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products', idEmpresa]);
    },
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (payload) => {
      return await createProductApi(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products', idEmpresa]);
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      return await updateProductApi(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products', idEmpresa]);
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