import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../../store/useAuthStore';
import { 
  listCategoriesByEmpresa, 
  createCategory as apiCreateCategory, 
  updateCategory as apiUpdateCategory, 
  deleteCategory as apiDeleteCategory 
} from '../api/categories.api';

export const useCategories = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const idEmpresa = user?.id_empresa;

  const {
    data: categories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['categories', idEmpresa],
    queryFn: async () => {
      if (!idEmpresa) {
        throw new Error('No se encontró la empresa del usuario');
      }
      return await listCategoriesByEmpresa(idEmpresa);
    },
    enabled: !!idEmpresa,
    staleTime: 5 * 60 * 1000,
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (payload) => {
      return await apiCreateCategory(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories', idEmpresa]);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      return await apiUpdateCategory(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories', idEmpresa]);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id) => {
      return await apiDeleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['categories', idEmpresa]);
    },
  });

  return {
    categories,
    isLoading,
    isError,
    error,
    refetch,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  };
};