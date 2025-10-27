import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Button, Input, LoadingSpinner } from '../shared/components/ui';
import { ImageUpload } from '../shared/components/forms';
import { ConfigurationLayout } from '../features/settings/components';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { getCompany, updateCompany } from '../features/settings/api/company.api';
import { validateCompany } from '../features/settings/schemas/company.schema';

const CompanySettingsPage = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { success, error: showError } = useToastStore();

  const [form, setForm] = useState({
    nombre: '',
    id_fiscal: '',
    direccion_fiscal: '',
    correo: '',
    telefono: '',
    simbolo_moneda: 'S/',
    currency: 'PEN',
    nombre_moneda: 'Soles',
    impuesto: 'IGV',
    valor_impuesto: 18.00,
    pie_pagina_ticket: '',
    logo: '',
  });

  const [errors, setErrors] = useState({});
  const idEmpresa = user?.id_empresa;

  // Cargar datos de la empresa
  const { data: company, isLoading } = useQuery({
    queryKey: ['company', idEmpresa],
    queryFn: () => getCompany(idEmpresa),
    enabled: !!idEmpresa,
  });

  // Actualizar formulario cuando se carguen los datos
  useEffect(() => {
    if (company) {
      setForm({
        nombre: company.nombre || '',
        id_fiscal: company.id_fiscal || '',
        direccion_fiscal: company.direccion_fiscal || '',
        correo: company.correo || company.email || '',
        telefono: company.telefono || '',
        simbolo_moneda: company.simbolo_moneda || 'S/',
        currency: company.currency || 'PEN',
        nombre_moneda: company.nombre_moneda || 'Soles',
        impuesto: company.impuesto || 'IGV',
        valor_impuesto: company.valor_impuesto || 18.00,
        pie_pagina_ticket: company.pie_pagina_ticket || '',
        logo: company.logo || company.logo_url || '',
      });
    }
  }, [company]);

  // Mutación para actualizar
  const updateMut = useMutation({
    mutationFn: (payload) => updateCompany(idEmpresa, payload),
    onSuccess: () => {
      success('Configuración de empresa actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: ['company', idEmpresa] });
    },
    onError: (err) => showError(err?.userMessage || 'Error al actualizar la configuración'),
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo al cambiar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar
    const validation = validateCompany(form);
    if (!validation.success) {
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }

    setErrors({});
    updateMut.mutate(form);
  };

  if (isLoading) {
    return (
      <ConfigurationLayout
        title="Configuración de Empresa"
        description="Gestiona la información general de tu empresa"
      >
        <Card>
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        </Card>
      </ConfigurationLayout>
    );
  }

  return (
    <ConfigurationLayout
      title="Configuración de Empresa"
      description="Gestiona la información general de tu empresa"
    >
      <form onSubmit={handleSubmit}>
        <Card title="Información General">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre de la Empresa"
              value={form.nombre}
              onChange={(v) => handleChange('nombre', v)}
              required
              error={errors.nombre}
            />
            <Input
              label="RUC / ID Fiscal"
              value={form.id_fiscal}
              onChange={(v) => handleChange('id_fiscal', v)}
              required
              error={errors.id_fiscal}
              hint="Número de identificación fiscal"
            />
            <div className="md:col-span-2">
              <Input
                label="Dirección Fiscal"
                value={form.direccion_fiscal}
                onChange={(v) => handleChange('direccion_fiscal', v)}
                required
                error={errors.direccion_fiscal}
              />
            </div>
            <Input
              label="Correo Electrónico"
              type="email"
              value={form.correo}
              onChange={(v) => handleChange('correo', v)}
              error={errors.correo}
            />
            <Input
              label="Teléfono"
              value={form.telefono}
              onChange={(v) => handleChange('telefono', v)}
              error={errors.telefono}
            />
          </div>
        </Card>

        <Card title="Configuración de Moneda e Impuestos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Símbolo de Moneda"
              value={form.simbolo_moneda}
              onChange={(v) => handleChange('simbolo_moneda', v)}
              placeholder="S/"
              error={errors.simbolo_moneda}
            />
            <Input
              label="Código de Moneda"
              value={form.currency}
              onChange={(v) => handleChange('currency', v)}
              placeholder="PEN"
              maxLength={3}
              error={errors.currency}
              hint="Código ISO de 3 letras"
            />
            <Input
              label="Nombre de Moneda"
              value={form.nombre_moneda}
              onChange={(v) => handleChange('nombre_moneda', v)}
              placeholder="Soles"
              error={errors.nombre_moneda}
            />
            <Input
              label="Nombre del Impuesto"
              value={form.impuesto}
              onChange={(v) => handleChange('impuesto', v)}
              placeholder="IGV"
              error={errors.impuesto}
            />
            <Input
              label="Valor del Impuesto (%)"
              type="number"
              value={form.valor_impuesto}
              onChange={(v) => handleChange('valor_impuesto', parseFloat(v) || 0)}
              min="0"
              max="100"
              step="0.01"
              error={errors.valor_impuesto}
            />
          </div>
        </Card>

        <Card title="Logo y Personalización" className="mt-6">
          <div className="space-y-4">
            <ImageUpload
              label="Logo de la Empresa"
              value={form.logo}
              onChange={(value, error) => {
                if (error) {
                  showError(error);
                } else {
                  handleChange('logo', value);
                }
              }}
              hint="Imagen que aparecerá en los tickets y documentos"
            />
            <div>
              <label className="block text-sm font-medium text-base-content mb-1">
                Pie de Página del Ticket
              </label>
              <textarea
                value={form.pie_pagina_ticket}
                onChange={(e) => handleChange('pie_pagina_ticket', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-base-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Texto que aparecerá al final de los tickets"
              />
              {errors.pie_pagina_ticket && (
                <p className="text-sm text-error mt-1">{errors.pie_pagina_ticket}</p>
              )}
            </div>
          </div>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={updateMut.isLoading}
          >
            {updateMut.isLoading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </ConfigurationLayout>
  );
};

export default CompanySettingsPage;