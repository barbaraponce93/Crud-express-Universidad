const { json } = require('express'); // para procesar solicitudes JSON
const db = require('../database/conexion');


class InscripcionesController {

    async inscribir(req, res) {
        const { curso_id, estudiante_id } = req.body;
        const conn = await db.getConnection(); //abrir una nueva coneccion 
        try {
            await conn.beginTransaction();//iniciar una transacción
            const [cursoRes] = await conn.query('SELECT COUNT(*) AS Cantidad FROM cursos WHERE id = ?', [curso_id]);
            if (cursoRes[0].Cantidad > 0) {
                await conn.rollback();
                return res.status(404).json({ error: "El curso no se ha encontrado" });
            }

            const [estudianteRes] = await conn.query('SELECT COUNT(*) AS Cantidad FROM estudiantes WHERE id = ?', [estudiante_id]);
            if (estudianteRes[0].Cantidad > 0) {
                await conn.rollback();
                return res.status(404).json({ error: "El estudiante no se ha encontrado..." });
            }
            
            
            const [existeRes] = await conn.query('SELECT COUNT(*) AS Cantidad FROM cursos_estudiantes WHERE estudiante_id = ?, curso_id = ?', [estudiante_id, curso_id]);
            if (existeRes[0].Cantidad > 0) {
                await conn.rollback();
                return res.status(404).json({ error: "El estudianteya esta inscripto en este curso" });
            }




                const [insertRes] = await conn.query('INSERT INTO cursos_estudiantes (id,curso_id,estudiante_id) VALUES (NULL,?,?)', [curso_id, estudiante_id]);
                if (insertRes.affectedRows === 1) {
                    await conn.commit();
                    res.status(200).json({mens:'Inscripción realizada' });// devolvemos EL ID insertado
                }
                else {
                    await conn.rollback();
                    res.status(400).send('La inscripción no se pudo realizar');
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
    //------------------------------------------------------------------------------------------------
    async consultarTodos(req, res) {//queremos que nos devuelva el nombre del estudiante y del curso
        try {
            const [rows] = await db.query(`SELECT estudiantes.nombre AS estudiante, cursos.nombre AS curso
                    FROM cursos_estudiantes
                    INNER JOIN cursos ON cursos.id=cursos_estudiantes.curso_id
                    INNER JOIN  estudiantes ON estudiantes.id= cursos_estudiantes.estudiante_id 
                     `);
            res.status(200).json(rows);
        }
        catch (err) {
            res.status(500).send(err.message);
        }


    }

    //-------------------------------------------------------------------------------------------------
    async consultarPorCurso(req, res) {
        try {
            const { id } = req.params;
            const [rows] = await db.query(`SELECT estudiantes.nombre AS 'Nombre Estudiante' , cursos.nombre AS 'Nombre Curso' 
                FROM cursos_estudiantes 
                INNER JOIN estudiantes  ON estudiantes.id= cursos_estudiantes.estudiante_id 
                INNER JOIN cursos ON cursos.id=cursos_estudiantes.curso_id
                 WHERE cursos.id=?`, [id]);
            res.status(200).json(rows);
        }
        catch (err) {
            res.status(500).send(err.message);
        }

    }
    async consultarPorEstudiante(req, res) {
        try {
            const { id } = req.params;
            const [rows] = await db.query(`SELECT estudiantes.nombre AS 'Nombre Estudiante',cursos.nombre AS 'Nombre Curso'
                FROM cursos_estudiantes  
                INNER JOIN estudiantes ON estudiantes.id= cursos_estudiantes.estudiante_id 
                INNER JOIN cursos ON cursos.id=cursos_estudiantes.curso_id 
                WHERE estudiantes.id=?`, [id]);
            res.status(200).json(rows);
        }
        catch (err) {
            res.status(500).send(err.message);
        }
    }
   /* async modificar(req, res) {
        const { curso_id,estudiante_id } = req.params;//id de la inscripción
        const { nota } = req.body;// id del curso y del estudiante que quiero modificar
        const conn = await db.getConnection(); //abrir una nueva coneccion 
    

        try {
            await conn.beginTransaction();//iniciar una transacción
           

            const [cursoRes] = await conn.query('SELECT COUNT(*) AS Cantidad FROM cursos WHERE id = ?', [curso_id]);
            if (cursoRes[0].Cantidad === 0) {
                await conn.rollback();
                return res.status(404).json({ error: "El curso no existe" });
            }

            const [estudianteRes] = await conn.query('SELECT COUNT(*) AS Cantidad FROM estudiantes WHERE id = ?', [estudiante_id]);
            if (estudianteRes[0].Cantidad === 0) {
                await conn.rollback();
                return res.status(404).send({ error: "El estudiante no existe" });
            }


                const [updateRes] = await conn.query(`UPDATE cursos_estudiantes SET nota=? WHERE curso_id=? AND estudiante_id=?`,   
                       [nota,curso_id, estudiante_id]);
                if (updateRes.affectedRows === 1) {
                    await conn.commit();
                    res.status(200).json({mens:'Inscripción modificada' });// devolvemos EL ID insertado
                }
                else {
                    await conn.rollback();
                    res.status(400).send('La inscripción no se pudo modificar');
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


     }*/
    async cancelarInscripcion(req, res) {
        const { curso_id, estudiante_id } = req.params;
        const conn=await db.getConnection(); //abrir una nueva coneccion
        try {
            await conn.beginTransaction();

            const [cursoRes] = await conn.query('SELECT COUNT(*) AS Cantidad FROM cursos WHERE id = ?', [curso_id]);
            if (cursoRes[0].Cantidad === 0) {
                await conn.rollback();
                return res.status(404).json({ error: "El curso no existe" });
            }


            const [estudianteRes] = await conn.query('SELECT COUNT(*) AS Cantidad FROM estudiantes WHERE id = ?', [estudiante_id]);
            if (estudianteRes[0].Cantidad === 0) {
                await conn.rollback();
                return res.status(404).send({ error: "El estudiante no existe" });
            }


            const [deleteRes]= await db.query('DELETE FROM cursos_estudiantes WHERE curso_id=? AND estudiante_id=?',[curso_id,estudiante_id]);
            if(deleteRes.affectedRows===1){
                res.status(200).json({ resultado: "Inscripción borrada" });
            }   
            else{   
                res.status(400).send('Inscripción no encontrada');
            }   
        } catch (err) { 
            res.status(500).send(err.message);
        }
     }



}


module.exports = new InscripcionesController();
