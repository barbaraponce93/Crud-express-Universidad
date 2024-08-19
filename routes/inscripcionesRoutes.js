const express=require('express');
const route=express.Router();
const inscripcionesController = require('../controller/inscripcionController');
 

route.get('/', inscripcionesController.consultarTodos);
route.post('/', inscripcionesController.inscribir);

route.get( '/xCurso/:id',inscripcionesController.consultarPorCurso);
route.get('/xEstudiante/:id',inscripcionesController.consultarPorEstudiante);

    
route.route('/:curso_id/:estudiante_id')
    .put(inscripcionesController.modificar)
    .delete(inscripcionesController.cancelarInscripcion);

module.exports=route ;