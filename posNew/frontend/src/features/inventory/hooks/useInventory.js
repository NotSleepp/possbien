import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/api';
import { useAuthStore } from '../../../store/useAuthStore';

/**
 * Custom hook for managing inventory data
 */
export const useInventory = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const idEmpresa = user?.id_empresa;

  // Fetch inventory for the user's company
  const {
    data: inventory = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['inventory', idEmpresa],
    queryFn: async () => {
      if (!idEmpresa) {
        throw new Error('No se encontró la empresa del usuario');
      }
      const response = await api.get(`/productos/inventario/${idEmpresa}`);
      return response.data;
    },
    enabled: !!idEmpresa,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update stock mutation
  const updateStockMutation = useMutation({
    mutationFn: async ({ productId, newStock, reason }) => {
      const response = await api.put(`/productos/${productId}/stock`, {
        stock_actual: newStock,
        motivo: reason,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory', idEmpresa]);
      queryClient.invalidateQueries(['products', idEmpresa]);
    },
  });

  // Bulk update stock mutation
  const bulkUpdateStockMutation = useMutation({
    mutationFn: async (updates) => {
      const response = await api.put('/productos/stock/bulk', {
        updates,
        id_empresa: idEmpresa,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory', idEmpresa]);
      queryClient.invalidateQueries(['products', idEmpresa]);
    },
  });

  // Get low stock products
  const {
    data: lowStockProducts = [],
    isLoading: isLoadingLowStock,
  } = useQuery({
    queryKey: ['inventory', 'low-stock', idEmpresa],
    queryFn: async () => {
      if (!idEmpresa) {
        throw new Error('No se encontró la empresa del usuario');
      }
      const response = await api.get(`/productos/stock-bajo/${idEmpresa}`);
      return response.data;
    },
    enabled: !!idEmpresa,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get inventory movements
  const useInventoryMovements = (productId) => {
    return useQuery({
      queryKey: ['inventory-movements', productId],
      queryFn: async () => {
        const response = await api.get(`/productos/${productId}/movimientos`);
        return response.data;
      },
      enabled: !!productId,
    });
  };

  // Create inventory movement
  const createMovementMutation = useMutation({
    mutationFn: async (movementData) => {
      const response = await api.post('/productos/movimientos', {
        ...movementData,
        id_empresa: idEmpresa,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['inventory', idEmpresa]);
      queryClient.invalidateQueries(['inventory-movements', variables.id_producto]);
      queryClient.invalidateQueries(['products', idEmpresa]);
    },
  });

  // Get inventory statistics
  const {
    data: inventoryStats,
    isLoading: isLoadingStats,
  } = useQuery({
    queryKey: ['inventory-stats', idEmpresa],
    queryFn: async () => {
      if (!idEmpresa) {
        throw new Error('No se encontró la empresa del usuario');
      }
      const response = await api.get(`/productos/estadisticas/${idEmpresa}`);
      return response.data;
    },
    enabled: !!idEmpresa,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    inventory,
    isLoading,
    isError,
    error,
    refetch,
    lowStockProducts,
    isLoadingLowStock,
    inventoryStats,
    isLoadingStats,
    updateStock: updateStockMutation.mutate,
    bulkUpdateStock: bulkUpdateStockMutation.mutate,
    createMovement: createMovementMutation.mutate,
    isUpdatingStock: updateStockMutation.isPending,
    isBulkUpdating: bulkUpdateStockMutation.isPending,
    isCreatingMovement: createMovementMutation.isPending,
    useInventoryMovements,
  };
};