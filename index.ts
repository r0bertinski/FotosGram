
import Server from './classes/server';
import userRoutes from './routes/users';
import mongoose from  'mongoose';
import bodyParser from 'body-parser';

const server = new Server();

// Body parser
server.app.use( bodyParser.urlencoded( { extended: true }) );
server.app.use( bodyParser.json() );

// Middleware user
server.app.use('/user', userRoutes);

mongoose.connect('mongodb://localhost:27017/fotosgram',
                 { useNewUrlParser: true, useCreateIndex: true}, ( err) => {

                    if ( err ) throw err;

                    console.log('Base de datos online');
                })

server.start( () => {
    console.log(`Servidor corriendo en puerto ${ server.port }`);
});