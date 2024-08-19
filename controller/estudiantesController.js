const { json } = require("express"); // para procesar solicitudes JSON
const db = require("../database/conexion");
const joi = require("joi");

class EstudianteController {
    constructor() { }

    //promesas: pueden tener uno de tres estados: exito, fracaso o pendiente.   Permite que la app siga haciendo tareas en segundo plano.
    async consultar(req, res) {
        try {
            const [rows] = await db.query("SELECT * FROM estudiantes");
            res.status(200).json(rows); // si todo sale bien devolvemos los datos de las filas en un JSON
        } catch (err) {
            res.status(500).send(err.message); // error del servidor
        }
    }

    async consultarUno(req, res) {
        try {
            const { id } = req.params;
            const [rows] = await db.query("SELECT * FROM estudiantes WHERE id = ?", [id]);
            if (rows.length > 0) {
                res.status(200).json(rows[0]); // devuelve un solo registro
            } else {
                res.status(404).json({ error: "Estudiante no encontrado" });
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async insertar(req, res) {
        const schema=joi.object({
            nombre:joi.string().required(),
            apellido:joi.string().required(),
            dni:joi.string().required(),
            email:joi.string().required()

        })
        try {
            const { dni, nombre, apellido, email } = req.body;
            const [result] = await db.query('INSERT INTO estudiantes(dni,nombre,apellido,email) VALUES (?,?,?,?)',
                [dni, nombre, apellido, email]);

            res.status(200).json({ id: rows.insertId }); // si todo sale bien devolvemos EL ID asignado

        } catch (err) {
            res.status(500).send(err.message); // error del servidor
        }
    }



    async modificar(req, res) {
   try {
    const schema=joi.object({
        nombre:joi.string().required(),
        apellido:joi.string().required(),
        dni:joi.string().required(),
        email:joi.string().required()

    })
        const { id } = req.params;
        const { dni, nombre, apellido, email } = req.body;
        const [result]=await db.query('UPDATE estudiantes SET dni = ?, nombre = ?, apellido = ?, email = ? WHERE id = ?',
            [dni, nombre, apellido, email, id]);
          if(result.affectedRows===1){
            res.status(200).json({Resultado: 'Estudiante Actualizado'});
          }
          else{
            res.status(404).send('Estudiante no encontrado');
          }
        
        } catch (err) {
            res.status(500).send(err.message); // error del servidor
        }
    }



    async borrar(req, res) {
        try {
            const { id } = req.params;
            const [result] = await db.query("DELETE FROM estudiantes WHERE id = ?", [id]);
            if(result.affectedRows===1){
                res.status(200).json({Resultado: 'Estudiante Borrado'});
              }
              else{
                res.status(404).send('Estudiante Borrado');
              }
            
            } catch (err) {
                res.status(500).send(err.message); // error del servidor
            }
        
    }
}

module.exports = new EstudianteController();
