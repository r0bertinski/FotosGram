
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
const mongo_db_port = process.env.MONGO_DB_PORT || 27017;
const mongo_db_server = process.env.MONGO_DB_SERVER || 'localhost';
const mongo_db_name = process.env.MONGO_DB_NAME || 'fotosgram';
const mongo_db_user = process.env.MONGO_DB_USER || 27017;
const mongo_db_pwd = process.env.MONGO_DB_PWD || null;



// const port = process.env.SERVER_PORT || 27017;

console.log('mongo_port', mongo_db_port);

//mongodb://<dbuser>:<dbpassword>@ds053176.mlab.com:53176/heroku_bt88x21m

mongoose.connect(`mongodb://${mongo_db_user}:${mongo_db_pwd}@${mongo_db_server}:${mongo_db_port}/${mongo_db_name}`,
                 { useNewUrlParser: true, useCreateIndex: true}, ( err) => {

                    if ( err ) { 
                        console.log('Error crash server');
                        throw err;
                    }

                    console.log(`Database online in por ${mongo_db_port}`);
                });

server.start( () => {
    console.log(`Servidor corriendo en puerto ${ server.port }`);
});
