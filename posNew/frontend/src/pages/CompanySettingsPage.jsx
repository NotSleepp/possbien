import { Card } from '../shared/components/ui';

const CompanySettingsPage = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-base-content">Empresa</h1>
      <p className="text-base-content/70 mb-4">Configura tu empresa</p>
      <Card>
        <p className="text-base-content">Esta es una página placeholder para configurar datos generales de la empresa.</p>
      </Card>
    </div>
  );
};

export default CompanySettingsPage;