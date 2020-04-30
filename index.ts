
import Server from './classes/server';
import userRoutes from './routes/user';
import mongoose from  'mongoose';
import bodyParser from 'body-parser';
import postRoutes from './routes/post';
import fileUpload from 'express-fileupload';
// CORS
import cors from 'cors';

const server = new Server();

// Config CORS (accept petitions from another origins)
server.app.use( cors ( { origin: true, credentials: true }));

// Body parser
server.app.use( bodyParser.urlencoded( { extended: true }) );
server.app.use( bodyParser.json() );

// FileUpload // this needs to be declared before postRoutes
server.app.use( fileUpload( { useTempFiles: true } ) );

// Middleware user
server.app.use('/user', userRoutes);

server.app.use('/posts', postRoutes);

// prod
// user:r0bertinski
// pwd:jf2BYbZmUpyFKXdd

mongoose.connect('mongodb://localhost:27017/fotosgram',
                 { useNewUrlParser: true, useCreateIndex: true}, ( err) => {

                    if ( err ) throw err;

                    console.log('Base de datos online');
                });

server.start( () => {
    console.log(`Servidor corriendo en puerto ${ server.port }`);
});