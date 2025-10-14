import app from './app.js';
const puerto = process.env.PORT || 3000;

app.listen(puerto, () => {
  console.log(`Servidor corriendo en el puerto ${puerto}`);
});