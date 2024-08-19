const express=require('express');
const route=express.Router();

const estudiantesController = require('../controller/estudiantesController');


//route.get('/',estudianteController.consultar);
//route.post('/',estudianteController.insertar);  

route.get('/', estudiantesController.consultar);

route.post('/', estudiantesController.insertar);

route.route('/:id')
    .put( estudiantesController.modificar)
    .delete( estudiantesController.borrar)
    .get(estudiantesController.consultarUno);

module.exports=route ;