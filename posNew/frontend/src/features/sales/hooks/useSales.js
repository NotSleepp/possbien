import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/api';
import { useAuthStore } from '../../../store/useAuthStore';

/**
 * Custom hook for managing sales data
 */
export const useSales = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const idSucursal = user?.id_sucursal;

  // Fetch all sales for the user's branch (sucursal)
  const {
    data: sales = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['sales', idSucursal],
    queryFn: async () => {
      if (!idSucursal) {
        throw new Error('No se encontró la sucursal del usuario');
      }
      const response = await api.get(`/ventas/por-sucursal/${idSucursal}`);
      return (response.data || []).map((venta) => ({
        ...venta,
        total: venta?.monto_total ?? venta?.total,
      }));
    },
    enabled: !!idSucursal,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create sale mutation
  const createSaleMutation = useMutation({
    mutationFn: async (saleData) => {
      const payload = {
        idSucursal: Number(idSucursal),
        idCliente:
          saleData?.idCliente ?? saleData?.id_cliente ?? saleData?.clienteId,
        fechaVenta:
          saleData?.fechaVenta ?? saleData?.fecha_venta ?? saleData?.fecha,
        montoTotal:
          saleData?.montoTotal ?? saleData?.total ?? saleData?.monto_total,
        estado: saleData?.estado,
        ...(saleData?.productos ? { productos: saleData.productos } : {}),
      };
      const response = await api.post('/ventas', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sales', idSucursal]);
    },
  });

  // Update sale mutation
  const updateSaleMutation = useMutation({
    mutationFn: async ({ id, ...saleData }) => {
      const payload = {
        idSucursal:
          saleData?.idSucursal ?? saleData?.id_sucursal ?? Number(idSucursal),
        idCliente:
          saleData?.idCliente ?? saleData?.id_cliente ?? saleData?.clienteId,
        fechaVenta:
          saleData?.fechaVenta ?? saleData?.fecha_venta ?? saleData?.fecha,
        montoTotal:
          saleData?.montoTotal ?? saleData?.total ?? saleData?.monto_total,
        estado: saleData?.estado,
      };
      const response = await api.put(`/ventas/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sales', idSucursal]);
    },
  });

  // Delete sale mutation
  const deleteSaleMutation = useMutation({
    mutationFn: async (saleId) => {
      await api.delete(`/ventas/${saleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sales', idSucursal]);
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