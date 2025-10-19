import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../shared/api/api';
import { useAuthStore } from '../../../store/useAuthStore';

export const useCustomers = () => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Fetch customers
  const {
    data: customers = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['customers', user?.id_empresa],
    queryFn: async () => {
      const response = await api.get(`/clientes/empresa/${user.id_empresa}`);
      return response.data;
    },
    enabled: !!user?.id_empresa,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create customer mutation
  const createCustomerMutation = useMutation({
    mutationFn: async (customerData) => {
      const response = await api.post('/clientes', {
        ...customerData,
        id_empresa: user.id_empresa,
        fecha_registro: new Date().toISOString(),
        activo: true
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error) => {
      console.error('Error creating customer:', error);
    },
  });

  // Update customer mutation
  const updateCustomerMutation = useMutation({
    mutationFn: async ({ id, ...customerData }) => {
      const response = await api.put(`/clientes/${id}`, customerData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error) => {
      console.error('Error updating customer:', error);
    },
  });

  // Delete customer mutation
  const deleteCustomerMutation = useMutation({
    mutationFn: async (customerId) => {
      const response = await api.delete(`/clientes/${customerId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error) => {
      console.error('Error deleting customer:', error);
    },
  });

  // Get customer by ID
  const useCustomer = (customerId) => {
    return useQuery({
      queryKey: ['customer', customerId],
      queryFn: async () => {
        const response = await api.get(`/clientes/${customerId}`);
        return response.data;
      },
      enabled: !!customerId,
    });
  };

  // Get customer purchase history
  const useCustomerPurchases = (customerId) => {
    return useQuery({
      queryKey: ['customer-purchases', customerId],
      queryFn: async () => {
        const response = await api.get(`/clientes/${customerId}/compras`);
        return response.data;
      },
      enabled: !!customerId,
    });
  };

  // Search customers
  const searchCustomers = async (searchTerm) => {
    if (!searchTerm.trim()) return customers;
    
    try {
      const response = await api.get(`/clientes/empresa/${user.id_empresa}/search`, {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching customers:', error);
      // Fallback to local filtering
      return customers.filter(customer =>
        customer.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.telefono?.includes(searchTerm) ||
        customer.documento?.includes(searchTerm)
      );
    }
  };

  // Get customer statistics
  const {
    data: customerStats,
    isLoading: isStatsLoading
  } = useQuery({
    queryKey: ['customer-stats', user?.id_empresa],
    queryFn: async () => {
      const response = await api.get(`/clientes/empresa/${user.id_empresa}/estadisticas`);
      return response.data;
    },
    enabled: !!user?.id_empresa,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Update customer status (activate/deactivate)
  const updateCustomerStatusMutation = useMutation({
    mutationFn: async ({ customerId, activo }) => {
      const response = await api.patch(`/clientes/${customerId}/estado`, { activo });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  // Add customer note
  const addCustomerNoteMutation = useMutation({
    mutationFn: async ({ customerId, nota }) => {
      const response = await api.post(`/clientes/${customerId}/notas`, {
        nota,
        fecha: new Date().toISOString(),
        id_usuario: user.id
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer', variables.customerId] });
    },
  });

  // Get top customers
  const {
    data: topCustomers = [],
    isLoading: isTopCustomersLoading
  } = useQuery({
    queryKey: ['top-customers', user?.id_empresa],
    queryFn: async () => {
      const response = await api.get(`/clientes/empresa/${user.id_empresa}/top`, {
        params: { limit: 10 }
      });
      return response.data;
    },
    enabled: !!user?.id_empresa,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });

  // Export customers
  const exportCustomersMutation = useMutation({
    mutationFn: async (format = 'excel') => {
      const response = await api.get(`/clientes/empresa/${user.id_empresa}/export`, {
        params: { format },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response.data;
    },
  });

  // Import customers
  const importCustomersMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('id_empresa', user.id_empresa);
      
      const response = await api.post('/clientes/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });

  return {
    // Customers data
    customers,
    isLoading,
    error,
    refetch,

    // Customer operations
    createCustomer: createCustomerMutation.mutateAsync,
    isCreating: createCustomerMutation.isPending,
    createCustomerError: createCustomerMutation.error,

    updateCustomer: updateCustomerMutation.mutateAsync,
    isUpdating: updateCustomerMutation.isPending,
    updateCustomerError: updateCustomerMutation.error,

    deleteCustomer: deleteCustomerMutation.mutateAsync,
    isDeleting: deleteCustomerMutation.isPending,
    deleteCustomerError: deleteCustomerMutation.error,

    // Individual customer
    useCustomer,
    useCustomerPurchases,

    // Search and filtering
    searchCustomers,

    // Statistics
    customerStats,
    isStatsLoading,
    topCustomers,
    isTopCustomersLoading,

    // Status management
    updateCustomerStatus: updateCustomerStatusMutation.mutateAsync,
    isUpdatingStatus: updateCustomerStatusMutation.isPending,

    // Notes
    addCustomerNote: addCustomerNoteMutation.mutateAsync,
    isAddingNote: addCustomerNoteMutation.isPending,

    // Import/Export
    exportCustomers: exportCustomersMutation.mutateAsync,
    isExporting: exportCustomersMutation.isPending,
    importCustomers: importCustomersMutation.mutateAsync,
    isImporting: importCustomersMutation.isPending,
  };
};