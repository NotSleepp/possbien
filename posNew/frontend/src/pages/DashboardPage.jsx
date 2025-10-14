import React from 'react';

const DashboardPage = () => {
  // Datos estáticos de ejemplo para métricas
  const salesData = { total: 12500 };
  const inventoryData = { count: 350 };

  return (
    <div className="p-4 md:p-6 bg-gray-100 w-full h-full min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 flex-1">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Ventas Totales</h2>
          <p className="text-4xl font-bold text-blue-600">${salesData.total.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Este mes</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Inventario</h2>
          <p className="text-4xl font-bold text-green-600">{inventoryData.count}</p>
          <p className="text-sm text-gray-500">Productos disponibles</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Usuarios Activos</h2>
          <p className="text-4xl font-bold text-purple-600">45</p>
          <p className="text-sm text-gray-500">Hoy</p>
        </div>
      </div>
      {/* Agrega más secciones como gráficos o tablas según sea necesario */}
    </div>
  );
};

export default DashboardPage;