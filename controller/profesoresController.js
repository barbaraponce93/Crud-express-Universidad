const { json } = require('express'); // para procesar solicitudes JSON
const db = require('../database/conexion');

class ProfesorController {
    constructor() {}

    async consultar(req, res) {
        try {
            const [rows] = await db.query("SELECT * FROM profesores");
            res.status(200).json(rows); // si todo sale bien devolvemos los datos de las filas en un JSON
        } catch (err) {
            res.status(500).send(err.message); // error del servidor
        }
    }

    async consultarUno(req, res) {
        try {
            const { id } = req.params;
            const [rows] = await db.query("SELECT * FROM profesores WHERE id = ?", [id]);
            if (rows.length > 0) {
                res.status(200).json(rows[0]); // devuelve un solo registro
            } else {
                res.status(404).json({ error: "PROFESOR no encontrado" });
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async insertar(req, res) {
        try {
            const {dni, nombre, apellido, email,profesion,telefono  } = req.body;
            const [result] = await db.query('INSERT INTO profesores (dni,nombre,apellido,email,profesion,telefono) VALUES (?,?,?,?,?,?)',
                [dni, nombre, apellido, email,profesion,telefono]);

            res.status(200).json({ id: rows.insertId }); // si todo sale bien devolvemos EL ID asignado

        } catch (err) {
            res.status(500).send(err.message); // error del servidor
        }
    }



    async modificar(req, res) {
   try {
        const { id } = req.params;
        const { dni, nombre, apellido, email,profesion,telefono } = req.body;
        const [result]=await db.query('UPDATE profesores SET dni = ?, nombre = ?, apellido = ?, email = ?,profesion=?,telefono=? WHERE id = ?',
            [dni, nombre, apellido, email, id,profesion,telefono]);
          if(result.affectedRows===1){
            res.status(200).json({Resultado: 'Profesor Actualizado'});
          }
          else{
            res.status(404).send('Profesor no encontrado');
          }
        } catch (err) {
            res.status(500).send(err.message); // error del servidor
        }
    }



    async borrar(req, res) {
         const { id } = req.params;
            const conn=await db.getConnection(); //abrir una nueva coneccion 
        try {
           await conn.beginTransaction();
           const [cursosRes]= await conn.query('SELECT COUNT(*) AS Cantidad FROM cursos WHERE id_profesor = ?', [id]);
           if(cursosRes[0].Cantidad>0){
            //await conn.rollback();
           return res.status(404).json({ error: "Profesor no puede ser borrado" });
           }
           else{
            const [deleteRes]=await conn.query('DELETE FROM profesores WHERE id = ?', [id]);
            if(deleteRes.affectedRows===1){
                res.status(200).json({ resultado: "Profesor borrado" });
                await conn.commit();
            }
            else{
                await conn.rollback();
                res.status(400).send('Profesor no encontrado');
            }
           }
            } catch (err) {
                try{
                    await conn.rollback();
                }
                catch(errRoll){
                res.status(500).send(errRoll.message); 
            }
            res.status(500).send(err.message); 
        }
            finally{
                conn.release();
            }
        }
        
    }




module.exports = new ProfesorController();
