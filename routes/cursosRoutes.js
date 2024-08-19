const express=require('express');
const route=express.Router();
const cursosController = require('../controller/cursosController');
 
route.get('/', cursosController.consultar);
route.post('/', cursosController.insertar);

route.route('/:id')
    .put( cursosController.modificar)
    .delete( cursosController.borrar)
    .get(cursosController.consultarUno);

module.exports=route ;