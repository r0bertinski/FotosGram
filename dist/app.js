"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const user_1 = __importDefault(require("./routes/user"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const post_1 = __importDefault(require("./routes/post"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
// CORS
const cors_1 = __importDefault(require("cors"));
const server = new server_1.default();
require('dotenv').config();
const env = process.env.NODE_ENV;
// Config CORS (accept petitions from another origins)
server.app.use(cors_1.default({ origin: true, credentials: true }));
// Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// FileUpload // this needs to be declared before postRoutes
server.app.use(express_fileupload_1.default({ useTempFiles: true }));
// Middleware user
server.app.use('/user', user_1.default);
server.app.use('/posts', post_1.default);
// prod
// user:r0bertinski
// pwd:jf2BYbZmUpyFKXdd
const mongo_db_port = process.env.MONGO_DB_PORT || 27017;
const mongo_db_server = process.env.MONGO_DB_SERVER || 'localhost';
const mongo_db_name = process.env.MONGO_DB_NAME || 'fotosgram';
const mongo_db_user = process.env.MONGO_DB_USER || 'papixulo';
const mongo_db_pwd = process.env.MONGO_DB_PWD || null;
console.log('mongo_port', mongo_db_port);
// By default we set the production env uri.
// let mongoConnetUrl = `mongodb://${mongo_db_user}:${mongo_db_pwd}@${mongo_db_server}:${mongo_db_port}/${mongo_db_name}`;
// 
let mongoConnetUrl = `mongodb://${mongo_db_server}:${mongo_db_port}/${mongo_db_name}`;
if (!process.env.dev) {
    mongoConnetUrl = `mongodb://${mongo_db_user}:${mongo_db_pwd}@${mongo_db_server}:${mongo_db_port}/${mongo_db_name}`;
}
console.log('mongoConnetUrl', mongoConnetUrl);
mongoose_1.default.connect(mongoConnetUrl, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err) {
        console.log('Error crash server');
        throw err;
    }
    console.log(`Database online in por ${mongo_db_port}`);
});
server.start(() => {
    console.log(`Servidor corriendo en puerto ${process.env.SERVER_PORT}`);
});
