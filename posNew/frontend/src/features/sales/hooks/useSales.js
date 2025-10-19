import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/api';
import { useAuthStore } from '../../../store/useAuthStore';

/**
 * Custom hook for managing sales data
 */
export const useSales = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const idEmpresa = user?.id_empresa;

  // Fetch all sales for the user's company
  const {
    data: sales = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['sales', idEmpresa],
    queryFn: async () => {
      if (!idEmpresa) {
        throw new Error('No se encontró la empresa del usuario');
      }
      const response = await api.get(`/ventas/por-empresa/${idEmpresa}`);
      return response.data;
    },
    enabled: !!idEmpresa,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create sale mutation
  const createSaleMutation = useMutation({
    mutationFn: async (saleData) => {
      const response = await api.post('/ventas', {
        ...saleData,
        id_empresa: idEmpresa,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sales', idEmpresa]);
    },
  });

  // Update sale mutation
  const updateSaleMutation = useMutation({
    mutationFn: async ({ id, ...saleData }) => {
      const response = await api.put(`/ventas/${id}`, saleData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sales', idEmpresa]);
    },
  });

  // Delete sale mutation
  const deleteSaleMutation = useMutation({
    mutationFn: async (saleId) => {
      await api.delete(`/ventas/${saleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sales', idEmpresa]);
    },
  });

  // Get sale by ID
  const useSaleById = (saleId) => {
    return useQuery({
      queryKey: ['sale', saleId],
      queryFn: async () => {
        const response = await api.get(`/ventas/${saleId}`);
        return response.data;
      },
      enabled: !!saleId,
    });
  };

  return {
    sales,
    isLoading,
    isError,
    error,
    refetch,
    createSale: createSaleMutation.mutate,
    updateSale: updateSaleMutation.mutate,
    deleteSale: deleteSaleMutation.mutate,
    isCreating: createSaleMutation.isPending,
    isUpdating: updateSaleMutation.isPending,
    isDeleting: deleteSaleMutation.isPending,
    useSaleById,
  };
};