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
const mongo_db_user = process.env.MONGO_DB_USER || 27017;
const mongo_db_pwd = process.env.MONGO_DB_PWD || null;
// const port = process.env.SERVER_PORT || 27017;
console.log('mongo_port', mongo_db_port);
//mongodb://<dbuser>:<dbpassword>@ds053176.mlab.com:53176/heroku_bt88x21m
mongoose_1.default.connect(`mongodb://${mongo_db_user}:${mongo_db_pwd}@${mongo_db_server}:${mongo_db_port}/${mongo_db_name}`, { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err)
        throw err;
    console.log(`Database online in por ${mongo_db_port}`);
});
server.start(() => {
    console.log(`Servidor corriendo en puerto ${this.port}`);
});
