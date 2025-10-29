/**
 * Receipt Printer Utility
 * Handles receipt printing with ESC/POS commands
 */

import { formatCurrency, formatDateTime } from './formatters';

/**
 * Format receipt data for printing
 * @param {object} sale - Sale data
 * @param {object} company - Company information
 * @returns {string} Formatted receipt text
 */
export const formatReceipt = (sale, company = {}) => {
  const lines = [];
  
  // Header
  lines.push('='.repeat(40));
  lines.push(company.nombre || 'SUPERMERCADO');
  lines.push(company.direccion || '');
  lines.push(`NIT: ${company.nit || 'N/A'}`);
  lines.push(`Tel: ${company.telefono || 'N/A'}`);
  lines.push('='.repeat(40));
  lines.push('');
  
  // Sale info
  lines.push(`Fecha: ${formatDateTime(sale.fecha_venta || new Date())}`);
  lines.push(`Factura: #${sale.id || 'N/A'}`);
  lines.push(`Cajero: ${sale.usuario_nombre || 'N/A'}`);
  lines.push('');
  lines.push('-'.repeat(40));
  
  // Items
  lines.push('PRODUCTOS');
  lines.push('-'.repeat(40));
  
  sale.items?.forEach(item => {
    lines.push(`${item.nombre || 'Producto'}`);
    lines.push(`  ${item.cantidad} x ${formatCurrency(item.precio_unitario)} = ${formatCurrency(item.subtotal)}`);
  });
  
  lines.push('-'.repeat(40));
  
  // Totals
  lines.push('');
  lines.push(`Subtotal:        ${formatCurrency(sale.subtotal || 0).padStart(20)}`);
  
  if (sale.descuento && sale.descuento > 0) {
    lines.push(`Descuento:       ${formatCurrency(sale.descuento).padStart(20)}`);
  }
  
  if (sale.impuestos && sale.impuestos > 0) {
    lines.push(`IVA (19%):       ${formatCurrency(sale.impuestos).padStart(20)}`);
  }
  
  lines.push('='.repeat(40));
  lines.push(`TOTAL:           ${formatCurrency(sale.total || 0).padStart(20)}`);
  lines.push('='.repeat(40));
  
  // Payment info
  if (sale.payment) {
    lines.push('');
    lines.push('PAGO');
    lines.push('-'.repeat(40));
    
    if (sale.payment.method === 'mixed') {
      sale.payment.splits?.forEach(split => {
        const methodName = {
          cash: 'Efectivo',
          card: 'Tarjeta',
          transfer: 'Transferencia',
        }[split.method] || split.method;
        
        lines.push(`${methodName}: ${formatCurrency(split.amount)}`);
      });
    } else {
      const methodName = {
        cash: 'Efectivo',
        card: 'Tarjeta',
        transfer: 'Transferencia',
      }[sale.payment.method] || sale.payment.method;
      
      lines.push(`Método: ${methodName}`);
      
      if (sale.payment.received) {
        lines.push(`Recibido: ${formatCurrency(sale.payment.received)}`);
        lines.push(`Cambio: ${formatCurrency(sale.payment.change || 0)}`);
      }
    }
  }
  
  // Customer info
  if (sale.cliente_info && sale.cliente_info.name) {
    lines.push('');
    lines.push('CLIENTE');
    lines.push('-'.repeat(40));
    lines.push(`Nombre: ${sale.cliente_info.name}`);
    if (sale.cliente_info.phone) {
      lines.push(`Teléfono: ${sale.cliente_info.phone}`);
    }
  }
  
  // Footer
  lines.push('');
  lines.push('='.repeat(40));
  lines.push('¡Gracias por su compra!');
  lines.push('Vuelva pronto');
  lines.push('='.repeat(40));
  lines.push('');
  lines.push('');
  lines.push('');
  
  return lines.join('\n');
};

/**
 * Print receipt to browser (print dialog)
 * @param {object} sale - Sale data
 * @param {object} company - Company information
 */
export const printReceiptBrowser = (sale, company) => {
  const receiptText = formatReceipt(sale, company);
  
  // Create print window
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    throw new Error('No se pudo abrir la ventana de impresión. Verifica los permisos del navegador.');
  }
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Recibo - ${sale.id}</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          line-height: 1.4;
          margin: 20px;
          white-space: pre-wrap;
        }
        @media print {
          body {
            margin: 0;
          }
        }
      </style>
    </head>
    <body>
      ${receiptText}
    </body>
    </html>
  `);
  
  printWindow.document.close();
  
  // Wait for content to load then print
  printWindow.onload = () => {
    printWindow.print();
    // Close after printing (optional)
    setTimeout(() => {
      printWindow.close();
    }, 100);
  };
};

/**
 * Send receipt via email (placeholder - requires backend)
 * @param {object} sale - Sale data
 * @param {string} email - Customer email
 */
export const sendReceiptEmail = async (sale, email) => {
  // This would call your backend API
  console.log('Sending receipt to:', email);
  throw new Error('Email sending not implemented yet');
};

/**
 * Download receipt as text file
 * @param {object} sale - Sale data
 * @param {object} company - Company information
 */
export const downloadReceipt = (sale, company) => {
  const receiptText = formatReceipt(sale, company);
  const blob = new Blob([receiptText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `recibo-${sale.id || Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};
