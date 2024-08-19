module.exports={
    host:'127.0.0.1',//localhost
    user: 'root',
    password:'',
    database:'universidad',
    port:3306,
    waitForConnections: true,//maneja cómo se gestionan las conexiones cuando el límite máximo de conexiones (connectionLimit) se ha alcanzado 
    connectionLimit:10,//limite de conexiones a la base de datos
    queueLimit:0// limite de peticiones en cola 
}
//waitForConnections: true
//maneja cómo se gestionan las conexiones cuando el límite máximo de 
//conexiones (connectionLimit) se ha alcanzado .
/*waitForConnections: true:
    Si esta opción está establecida en true, cuando se alcanza el límite máximo de
    conexiones, cualquier nueva solicitud de conexión se pondrá en una cola de espera.
    Las solicitudes en la cola se atenderán en orden a medida que se liberen 
    conexiones existentes.
   Esto permite que tu aplicación maneje un número alto de solicitudes de conexión
   de manera más eficiente, sin rechazar inmediatamente las nuevas solicitudes 
   cuando el límite de conexiones se alcanza.

waitForConnections: false:
   Si esta opción está establecida en false, cuando se alcanza el límite máximo
  de conexiones, cualquier nueva solicitud de conexión será rechazada inmediatamente
   con un error.*/