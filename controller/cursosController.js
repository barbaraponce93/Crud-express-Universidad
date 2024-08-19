const { json } = require('express'); // para procesar solicitudes JSON
const db = require('../database/conexion');
const joi = require('joi');

class CursosController {
    constructor() { }

    async consultar(req, res) {
        try {
            const [rows] = await db.query("SELECT * FROM cursos");
            res.status(200).json(rows); // si todo sale bien devolvemos los datos de las filas en un JSON
        } catch (err) {
            res.status(500).send(err.message); // error del servidor
        }
    }

    //----------------------------------------------------------------------------------------------------
    async consultarUno(req, res) {
        try {
            const { id } = req.params;
            const [rows] = await db.query("SELECT * FROM cursos WHERE id = ?", [id]);
            if (rows.length > 0) {
                res.status(200).json(rows[0]); // devuelve un solo registro
            } else {
                res.status(404).json({ error: "Curso no encontrado" });
            }
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    //----------------------------------------------------------------------------------------------------
    async insertar(req, res) {
        const schema = joi.object({
            nombre: joi.string().required(),
            descripcion: joi.string().required(),
            profesor_id: joi.number().integer().required()
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { nombre, descripcion, profesor_id } = req.body;
        const conn = await db.getConnection(); //abrir una nueva coneccion 
        try {
            await conn.beginTransaction();//iniciar una transacción
            const [profeRes] = await conn.query('SELECT COUNT(*) AS Cantidad FROM profesores WHERE id = ?', [profesor_id]);
            if (profeRes[0].Cantidad === 0) {
                await conn.rollback();
                return res.status(404).json({ error: "El profesor no se ha encontrado" });
            }
            else {
                const [insertRes] = await conn.query('INSERT INTO cursos (id,nombre,descripcion,profesor_id) VALUES (NULL,?,?,?)', [nombre, descripcion, profesor_id]);
                if (insertRes.affectedRows === 1) {
                    await conn.commit();
                    res.status(200).json({ ID: insertRes.insertId });// devolvemos EL ID insertado

                }
                else {
                    await conn.rollback();
                    res.status(400).send('El curso no pudo ser insertado');
                }
            }
        } catch (err) {
            try {
                await conn.rollback();
            }
            catch (errRoll) {
                res.status(500).send(errRoll.message);
            }
            res.status(500).send(err.message); // error del servidor
        }
        finally {
            conn.release();
        }
    }


    //----------------------------------------------------------------------------------------------------

    async modificar(req, res) {
        try {
            const conn = await db.getConnection();
            const { id } = req.params;
            const { nombre, descripcion, profesor_id } = req.body;
            await conn.beginTransaction();
            const [profeRes] = await conn.query('SELECT COUNT(*) AS Cantidad FROM profesores WHERE id = ?', [profesor_id]);
            if (profeRes[0].Cantidad === 0) {
                //await conn.rollback();
                return res.status(404).json({ error: "El profesor no se ha encontrado" });
            }

            const [result] = await db.query('UPDATE cursos SET nombre=?,descripcion=?,profesor_id=? WHERE id = ?',
                [nombre, descripcion, profesor_id, id]);
            if (result.affectedRows === 1) {
                await conn.commit();
                res.status(200).json({ Resultado: 'Curso Actualizado' });
            }
            else {
                await conn.rollback();
                res.status(404).send('Curso no encontrado');
            }

        } catch (err) {
            try {
                await conn.rollback();
            }
            catch (errRoll) {
                res.status(500).send(err.message);
            }
            res.status(500).send(err.message);
        }
        finally {
            conn.release();
        }
    }

    //----------------------------------------------------------------------------------------------------
    async borrar(req, res) {
        const { id } = req.params;
        try {
            const [deleteRes] = await db.query('DELETE FROM cursos Where id=?', [id]);
            if (deleteRes.affectedRows === 1) {
                res.status(200).json({ resultado: "Curso borrado" });
            }
            else {
                res.status(400).send('Curso no encontrado');
            }
        } catch (err) {
            res.status(500).send(err.message);
        }

    }

}


module.exports = new CursosController();
