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
    console.log('[CompanySettings] Company data loaded:', company);
    if (company) {
      const newForm = {
        nombre: company.nombre || '',
        id_fiscal: company.id_fiscal || '',
        direccion_fiscal: company.direccion_fiscal || '',
        correo: company.correo || company.email || '',
        telefono: company.telefono || '',
        simbolo_moneda: company.simbolo_moneda || 'S/',
        currency: company.currency || 'PEN',
        nombre_moneda: company.nombre_moneda || 'Soles',
        impuesto: company.impuesto || 'IGV',
        valor_impuesto: parseFloat(company.valor_impuesto) || 18.00,
        pie_pagina_ticket: company.pie_pagina_ticket || '',
        logo: company.logo || company.logo_url || '',
      };
      console.log('[CompanySettings] valor_impuesto loaded as:', typeof newForm.valor_impuesto, newForm.valor_impuesto);
      console.log('[CompanySettings] Setting form with data:', newForm);
      setForm(newForm);
    }
  }, [company]);

  // Mutación para actualizar
  const updateMut = useMutation({
    mutationFn: (payload) => {
      console.log('[CompanySettings] Mutation started with payload:', payload);
      return updateCompany(idEmpresa, payload);
    },
    onSuccess: (data) => {
      console.log('[CompanySettings] Mutation SUCCESS! Response:', data);
      success('Configuración de empresa actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: ['company', idEmpresa] });
    },
    onError: (err) => {
      console.error('[CompanySettings] Mutation ERROR:', err);
      console.error('[CompanySettings] Error details:', {
        message: err?.message,
        userMessage: err?.userMessage,
        response: err?.response,
        status: err?.response?.status,
        data: err?.response?.data,
      });
      showError(err?.userMessage || 'Error al actualizar la configuración');
    },
  });

  const handleChange = (field, value) => {
    console.log(`[CompanySettings] Field changed: ${field} = `, value);
    setForm((prev) => {
      const newForm = { ...prev, [field]: value };
      console.log('[CompanySettings] New form state:', newForm);
      return newForm;
    });
    // Limpiar error del campo al cambiar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('[CompanySettings] ========== SUBMIT STARTED ==========');
    console.log('[CompanySettings] Form data being submitted:', form);
    console.log('[CompanySettings] Form field types:', {
      nombre: typeof form.nombre,
      id_fiscal: typeof form.id_fiscal,
      direccion_fiscal: typeof form.direccion_fiscal,
      correo: typeof form.correo,
      telefono: typeof form.telefono,
      valor_impuesto: typeof form.valor_impuesto,
    });

    // Validar
    console.log('[CompanySettings] Starting validation...');
    const validation = validateCompany(form);
    console.log('[CompanySettings] Validation result:', validation);
    
    if (!validation.success) {
      console.error('[CompanySettings] Validation FAILED!');
      console.error('[CompanySettings] Errors:', validation.errors);
      setErrors(validation.errors);
      showError('Por favor corrige los errores en el formulario');
      return;
    }

    console.log('[CompanySettings] Validation SUCCESS! Sending to backend...');
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
              error={errors.nombre}
              hint="Máximo 255 caracteres"
            />
            <Input
              label="RUC / ID Fiscal"
              value={form.id_fiscal}
              onChange={(v) => handleChange('id_fiscal', v)}
              error={errors.id_fiscal}
              hint="Máximo 50 caracteres"
            />
            <div className="md:col-span-2">
              <Input
                label="Dirección Fiscal"
                value={form.direccion_fiscal}
                onChange={(v) => handleChange('direccion_fiscal', v)}
                error={errors.direccion_fiscal}
                hint="Máximo 500 caracteres"
              />
            </div>
            <Input
              label="Correo Electrónico"
              type="email"
              value={form.correo}
              onChange={(v) => handleChange('correo', v)}
              error={errors.correo}
              hint="Máximo 100 caracteres"
            />
            <Input
              label="Teléfono"
              value={form.telefono}
              onChange={(v) => handleChange('telefono', v)}
              error={errors.telefono}
              hint="Máximo 20 caracteres"
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
              hint="Máximo 10 caracteres"
            />
            <Input
              label="Código de Moneda"
              value={form.currency}
              onChange={(v) => handleChange('currency', v)}
              placeholder="PEN"
              error={errors.currency}
              hint="Máximo 10 caracteres (ej: PEN, USD)"
            />
            <Input
              label="Nombre de Moneda"
              value={form.nombre_moneda}
              onChange={(v) => handleChange('nombre_moneda', v)}
              placeholder="Soles"
              error={errors.nombre_moneda}
              hint="Máximo 50 caracteres"
            />
            <Input
              label="Nombre del Impuesto"
              value={form.impuesto}
              onChange={(v) => handleChange('impuesto', v)}
              placeholder="IGV"
              error={errors.impuesto}
              hint="Máximo 50 caracteres"
            />
            <Input
              label="Valor del Impuesto (%)"
              type="number"
              value={form.valor_impuesto}
              onChange={(v) => {
                const numValue = v === '' ? 0 : parseFloat(v);
                console.log(`[CompanySettings] Converting valor_impuesto: '${v}' -> ${numValue} (type: ${typeof numValue})`);
                handleChange('valor_impuesto', numValue);
              }}
              step="0.01"
              error={errors.valor_impuesto}
              hint="Valor del impuesto en porcentaje"
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
              {!errors.pie_pagina_ticket && (
                <p className="text-sm text-base-content/60 mt-1">Máximo 500 caracteres</p>
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