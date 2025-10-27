import express from 'express';
import * as servicio from './servicio.almacenes.js';

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('POST /api/almacenes - req.body:', req.body);
  try {
    const almacen = await servicio.crearAlmacen(req.body);
    res.status(201).json(almacen);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/por-empresa/:idEmpresa', async (req, res) => {
  try {
    const idEmpresa = parseInt(req.params.idEmpresa);
    const almacenes = await servicio.obtenerAlmacenesPorEmpresa(idEmpresa);
    res.json(almacenes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/por-sucursal/:idSucursal', async (req, res) => {
  try {
    const idSucursal = parseInt(req.params.idSucursal);
    const almacenes = await servicio.obtenerAlmacenesPorSucursal(idSucursal);
    res.json(almacenes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const almacen = await servicio.obtenerAlmacenPorId(id);
    if (!almacen) {
      return res.status(404).json({ error: 'Almacen no encontrado' });
    }
    res.json(almacen);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const almacen = await servicio.actualizarAlmacen(id, req.body);
    res.json(almacen);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await servicio.eliminarAlmacen(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
