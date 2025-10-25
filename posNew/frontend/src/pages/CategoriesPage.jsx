import { Card } from '../shared/components/ui';

const CategoriesPage = () => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-base-content">Categorías de productos</h1>
      <p className="text-base-content/70 mb-4">Asigna categorías a tus productos</p>
      <Card>
        <p className="text-base-content">Página placeholder para gestión de categorías.</p>
      </Card>
    </div>
  );
};

export default CategoriesPage;