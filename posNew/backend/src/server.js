import app from './app.js';
import ensureDefaultModules from './bootstrap/ensureModules.js';
const puerto = process.env.PORT || 3000;

ensureDefaultModules()
  .catch((err) => {
    console.error('[server] Error al asegurar módulos:', err);
  })
  .finally(() => {
    app.listen(puerto, () => {
      console.log(`Servidor corriendo en el puerto ${puerto}`);
    });
  });