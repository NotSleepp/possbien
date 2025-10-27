const Joi = require('joi');

/**
 * Schema para crear un permiso individual
 */
const esquemaCrearPermiso = Joi.object({
  id_empresa: Joi.number().integer().positive().required(),
  id_rol: Joi.number().integer().positive().required(),
  id_modulo: Joi.number().integer().positive().required(),
  puede_ver: Joi.boolean().default(false),
  puede_crear: Joi.boolean().default(false),
  puede_editar: Joi.boolean().default(false),
  puede_eliminar: Joi.boolean().default(false)
});

/**
 * Schema para actualización masiva de permisos
 */
const esquemaActualizarPermisos = Joi.object({
  id_empresa: Joi.number().integer().positive().required(),
  id_rol: Joi.number().integer().positive().required(),
  permisos: Joi.array().items(esquemaCrearPermiso).min(1).required()
});

module.exports = {
  esquemaCrearPermiso,
  esquemaActualizarPermisos
};
