const express=require('express');
const route=express.Router();

const profesoresController = require('../controller/profesoresController');


route.get('/',profesoresController.consultar);

route.post('/', profesoresController.insertar);

route.route('/:id')
    .put( profesoresController.modificar)
    .delete( profesoresController.borrar)
    .get(profesoresController.consultarUno);

module.exports=route ;