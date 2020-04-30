
import Server from './classes/server';
import userRoutes from './routes/user';
import mongoose from  'mongoose';
import bodyParser from 'body-parser';
import postRoutes from './routes/post';
import fileUpload from 'express-fileupload';
// CORS
import cors from 'cors';

const server = new Server();
require('dotenv').config()


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
const mongo_port = process.env.MONGO_PORT || 27017;
// const port = process.env.SERVER_PORT || 27017;

console.log('mongo_port', mongo_port);


mongoose.connect(`mongodb://localhost:${mongo_port}/fotosgram`,
                 { useNewUrlParser: true, useCreateIndex: true}, ( err) => {

                    if ( err ) throw err;

                    console.log(`Database online in por ${mongo_port}`);
                });

server.start( () => {
    console.log(`Servidor corriendo en puerto ${ this.port }`);
});