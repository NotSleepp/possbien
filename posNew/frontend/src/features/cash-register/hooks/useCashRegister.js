import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { api } from '../../../shared/api/api';
import { useAuthStore } from '../../../store/useAuthStore';

export const useCashRegister = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Fetch products for cash register
  const {
    data: products = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['cash-register-products', user?.id_empresa],
    queryFn: async () => {
      const response = await api.get(`/productos/empresa/${user.id_empresa}`);
      return response.data.filter(product => product.stock_actual > 0); // Only show products with stock
    },
    enabled: !!user?.id_empresa,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Search products (memoized)
  const searchProducts = useCallback(async (searchTerm) => {
    const term = searchTerm.trim();
    if (!term) return products;

    // Umbral mínimo: evitar llamadas al backend con 1 carácter
    if (term.length < 2) {
      return products.filter(product =>
        product.nombre?.toLowerCase().includes(term.toLowerCase()) ||
        product.codigo?.toLowerCase().includes(term.toLowerCase()) ||
        product.codigo_barras?.toLowerCase().includes(term.toLowerCase()) ||
        product.codigo_interno?.toLowerCase().includes(term.toLowerCase()) ||
        product.sku?.toLowerCase().includes(term.toLowerCase())
      );
    }

    try {
      const response = await api.get(`/productos/empresa/${user.id_empresa}/search`, {
        params: { q: term }
      });
      return (response.data || []).filter(product => product.stock_actual > 0);
    } catch (error) {
      console.error('Error searching products:', error);
      // Fallback local
      return products.filter(product =>
        product.nombre?.toLowerCase().includes(term.toLowerCase()) ||
        product.codigo?.toLowerCase().includes(term.toLowerCase()) ||
        product.codigo_barras?.toLowerCase().includes(term.toLowerCase()) ||
        product.codigo_interno?.toLowerCase().includes(term.toLowerCase()) ||
        product.sku?.toLowerCase().includes(term.toLowerCase())
      );
    }
  }, [user?.id_empresa, products]);

  // Process sale mutation
  const processSaleMutation = useMutation({
    mutationFn: async (saleData) => {
      const response = await api.post('/ventas', {
        ...saleData,
        id_empresa: user.id_empresa,
        id_usuario: user.id,
        fecha_venta: new Date().toISOString(),
        estado: 'completada'
      });
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['cash-register-products'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      
      // Show success message
      console.log('Sale processed successfully:', data);
    },
    onError: (error) => {
      console.error('Error processing sale:', error);
    },
  });

  // Get daily sales summary
  const {
    data: dailySummary,
    isLoading: isDailySummaryLoading
  } = useQuery({
    queryKey: ['daily-summary', user?.id_empresa, new Date().toDateString()],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.get(`/ventas/empresa/${user.id_empresa}/resumen`, {
        params: { fecha: today }
      });
      return response.data;
    },
    enabled: !!user?.id_empresa,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Open cash register mutation
  const openCashRegisterMutation = useMutation({
    mutationFn: async (initialAmount) => {
      const response = await api.post('/caja/abrir', {
        id_empresa: user.id_empresa,
        id_usuario: user.id,
        monto_inicial: initialAmount,
        fecha_apertura: new Date().toISOString()
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-register-status'] });
    },
  });

  // Close cash register mutation
  const closeCashRegisterMutation = useMutation({
    mutationFn: async (finalAmount) => {
      const response = await api.post('/caja/cerrar', {
        id_empresa: user.id_empresa,
        id_usuario: user.id,
        monto_final: finalAmount,
        fecha_cierre: new Date().toISOString()
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-register-status'] });
      queryClient.invalidateQueries({ queryKey: ['daily-summary'] });
    },
  });

  // Get cash register status
  const {
    data: cashRegisterStatus,
    isLoading: isCashRegisterStatusLoading
  } = useQuery({
    queryKey: ['cash-register-status', user?.id_empresa],
    queryFn: async () => {
      const response = await api.get(`/caja/estado/${user.id_empresa}`);
      return response.data;
    },
    enabled: !!user?.id_empresa,
  });

  // Apply discount mutation
  const applyDiscountMutation = useMutation({
    mutationFn: async ({ saleId, discountType, discountValue }) => {
      const response = await api.post(`/ventas/${saleId}/descuento`, {
        tipo_descuento: discountType, // 'percentage' or 'fixed'
        valor_descuento: discountValue
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    },
  });

  // Print receipt mutation
  const printReceiptMutation = useMutation({
    mutationFn: async (saleId) => {
      const response = await api.post(`/ventas/${saleId}/imprimir`);
      return response.data;
    },
  });

  return {
    // Products
    products,
    isLoading,
    error,
    refetch,
    searchProducts,

    // Sales
    processSale: processSaleMutation.mutateAsync,
    isProcessing: processSaleMutation.isPending,
    processSaleError: processSaleMutation.error,

    // Daily summary
    dailySummary,
    isDailySummaryLoading,

    // Cash register operations
    openCashRegister: openCashRegisterMutation.mutateAsync,
    isOpeningCashRegister: openCashRegisterMutation.isPending,
    closeCashRegister: closeCashRegisterMutation.mutateAsync,
    isClosingCashRegister: closeCashRegisterMutation.isPending,
    cashRegisterStatus,
    isCashRegisterStatusLoading,

    // Additional operations
    applyDiscount: applyDiscountMutation.mutateAsync,
    isApplyingDiscount: applyDiscountMutation.isPending,
    printReceipt: printReceiptMutation.mutateAsync,
    isPrintingReceipt: printReceiptMutation.isPending,
  };
};