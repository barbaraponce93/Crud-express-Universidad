const express=require('express');
const app=express();// instancia de una aplicación Express, permite configurar y manejar las rutas y los middleware 
const cors=require('cors');// middleware que permite o restringe las solicitudes entre diferentes dominios
const estudiantesRoute=require('./routes/estudiantesRoutes');
const profesoresRoute=require('./routes/profesoresRoutes');
const cursosRoute=require('./routes/cursosRoutes');
const inscripcionesRoute=require('./routes/inscripcionesRoutes')

app.get('/',(req,res)=>{// ruta para manejar solicitudes GET al endpoint raíz (/)
    res.send('Universidad');
});

app.use(express.json());// middleware que permite procesar solicitudes JSON nos permite mandar informacio desde el body
app.use(cors());

app.use('/estudiantes',estudiantesRoute);// ruta para manejar solicitudes /estudiantes
app.use('/profesores', profesoresRoute);// ruta para manejar solicitudes /profesores
app.use('/cursos',cursosRoute);// ruta para manejar solicitudes  /cursos
app.use('/inscripciones',inscripcionesRoute);




/*node --watch index.js
se utiliza para ejecutar un archivo Node.js (index.js en este caso) y observar automáticamente los cambios en el código.*/ 
/*y no necesitas usar nodemon*/ 
app.listen(4000,()=>{
    console.log('Servidor activo en el puerto 4000');
});